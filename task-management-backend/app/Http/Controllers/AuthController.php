<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\OtpVerification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'nullable|string|max:20',
            'role_id' => 'required|exists:roles,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'role_id' => $request->role_id,
            'email_verified_at' => now(), // Auto-verify for development
        ]);

        // Send email verification OTP (commented out for development)
        // $this->sendEmailVerificationOTP($user->email);

        return response()->json([
            'message' => 'User registered successfully. You can now login.',
            'user' => $user->load('role')
        ], 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $credentials = $request->only('email', 'password');

        try {
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'Invalid credentials'], 401);
            }

            $user = auth()->user();
            
            if ($user->status !== 'active') {
                return response()->json(['error' => 'Account is not active'], 403);
            }

            // Skip email verification in development
            if (config('app.env') === 'production' && !$user->email_verified_at) {
                return response()->json(['error' => 'Email not verified'], 403);
            }

            // Check if 2FA is enabled
            if ($user->two_factor_enabled) {
                // Send 2FA OTP
                $this->sendTwoFactorOTP($user->email);
                return response()->json([
                    'message' => '2FA OTP sent to your email',
                    'requires_2fa' => true,
                    'temp_token' => $token
                ]);
            }

            $user->update(['last_login_at' => now()]);

            return $this->respondWithToken($token, $user);

        } catch (JWTException $e) {
            return response()->json(['error' => 'Could not create token'], 500);
        }
    }

    public function verifyEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'otp' => 'required|string|size:6'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $otpRecord = OtpVerification::where('email', $request->email)
            ->where('otp', $request->otp)
            ->where('type', 'email_verification')
            ->where('is_used', false)
            ->where('expires_at', '>', now())
            ->first();

        if (!$otpRecord) {
            return response()->json(['error' => 'Invalid or expired OTP'], 400);
        }

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $user->update(['email_verified_at' => now()]);
        $otpRecord->update(['is_used' => true, 'used_at' => now()]);

        return response()->json(['message' => 'Email verified successfully']);
    }

    public function verify2FA(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'otp' => 'required|string|size:6',
            'temp_token' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $otpRecord = OtpVerification::where('email', $request->email)
            ->where('otp', $request->otp)
            ->where('type', 'two_factor')
            ->where('is_used', false)
            ->where('expires_at', '>', now())
            ->first();

        if (!$otpRecord) {
            return response()->json(['error' => 'Invalid or expired OTP'], 400);
        }

        try {
            JWTAuth::setToken($request->temp_token);
            $user = JWTAuth::authenticate();
            
            if (!$user || $user->email !== $request->email) {
                return response()->json(['error' => 'Invalid token'], 401);
            }

            $otpRecord->update(['is_used' => true, 'used_at' => now()]);
            $user->update(['last_login_at' => now()]);

            return $this->respondWithToken($request->temp_token, $user);

        } catch (JWTException $e) {
            return response()->json(['error' => 'Invalid token'], 401);
        }
    }

    public function logout()
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
            return response()->json(['message' => 'Successfully logged out']);
        } catch (JWTException $e) {
            return response()->json(['error' => 'Failed to logout'], 500);
        }
    }

    public function refresh()
    {
        try {
            $newToken = JWTAuth::refresh(JWTAuth::getToken());
            JWTAuth::setToken($newToken);
            $user = JWTAuth::authenticate();
            return $this->respondWithToken($newToken, $user);
        } catch (JWTException $e) {
            return response()->json(['error' => 'Could not refresh token'], 401);
        }
    }

    public function profile()
    {
        return response()->json(auth()->user()->load('role'));
    }

    public function updateProfile(Request $request)
    {
        $user = auth()->user();
        
        $validator = Validator::make($request->all(), [
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|nullable|string|max:20',
            'timezone' => 'sometimes|string|max:50',
            'preferences' => 'sometimes|array'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user->update($request->only(['first_name', 'last_name', 'phone', 'timezone', 'preferences']));

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user->load('role')
        ]);
    }

    public function updateAvatar(Request $request)
    {
        // Check if user is authenticated
        if (!auth()->check()) {
            return response()->json(['error' => 'Unauthenticated. Please login to update avatar.'], 401);
        }

        $user = auth()->user();

        // Check if user account is active
        if ($user->status !== 'active') {
            return response()->json(['error' => 'Your account is not active. Contact administrator.'], 403);
        }

        // Validate file
        $validator = Validator::make($request->all(), [
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:5120' // 5MB max
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            // Delete old avatar if it exists
            if ($user->avatar) {
                $oldPath = str_replace('/storage/', '', $user->avatar);
                if (\Illuminate\Support\Facades\Storage::disk('public')->exists($oldPath)) {
                    \Illuminate\Support\Facades\Storage::disk('public')->delete($oldPath);
                }
            }

            // Store new avatar
            $file = $request->file('avatar');
            $filename = 'avatars/' . $user->id . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = \Illuminate\Support\Facades\Storage::disk('public')->put($filename, file_get_contents($file));

            if (!$path) {
                return response()->json(['error' => 'Failed to upload avatar'], 500);
            }

            // Update user avatar path
            $avatarUrl = url('/storage/' . $filename);
            $user->update(['avatar' => $avatarUrl]);

            // Log activity
            \Illuminate\Support\Facades\Log::info('Avatar updated', [
                'user_id' => $user->id,
                'user_email' => $user->email,
                'avatar_url' => $avatarUrl,
                'timestamp' => now()
            ]);

            return response()->json([
                'message' => 'Avatar updated successfully',
                'user' => $user->load('role')
            ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Avatar upload failed', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
                'timestamp' => now()
            ]);
            return response()->json(['error' => 'Failed to upload avatar: ' . $e->getMessage()], 500);
        }
    }

    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = auth()->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['error' => 'Current password is incorrect'], 400);
        }

        $user->update(['password' => Hash::make($request->new_password)]);

        return response()->json(['message' => 'Password changed successfully']);
    }

    public function enable2FA(Request $request)
    {
        $user = auth()->user();
        
        if ($user->two_factor_enabled) {
            return response()->json(['error' => '2FA is already enabled'], 400);
        }

        $user->update(['two_factor_enabled' => true]);

        return response()->json(['message' => '2FA enabled successfully']);
    }

    public function disable2FA(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'password' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = auth()->user();

        if (!Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Password is incorrect'], 400);
        }

        $user->update([
            'two_factor_enabled' => false,
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null
        ]);

        return response()->json(['message' => '2FA disabled successfully']);
    }

    protected function respondWithToken($token, $user)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => JWTAuth::factory()->getTTL() * 60,
            'user' => $user->load('role')
        ]);
    }

    protected function sendEmailVerificationOTP($email)
    {
        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        
        OtpVerification::create([
            'email' => $email,
            'otp' => $otp,
            'type' => 'email_verification',
            'expires_at' => now()->addMinutes(10),
            'ip_address' => request()->ip()
        ]);

        // Send email (implement mail sending logic)
        // Mail::to($email)->send(new EmailVerificationMail($otp));
    }

    protected function sendTwoFactorOTP($email)
    {
        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        
        OtpVerification::create([
            'email' => $email,
            'otp' => $otp,
            'type' => 'two_factor',
            'expires_at' => now()->addMinutes(5),
            'ip_address' => request()->ip()
        ]);

        // Send email (implement mail sending logic)
        // Mail::to($email)->send(new TwoFactorMail($otp));
    }
}
