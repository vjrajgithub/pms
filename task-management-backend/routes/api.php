<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TaskCommentController;
use App\Http\Controllers\TaskAttachmentController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProjectCommentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/verify-2fa', [AuthController::class, 'verify2FA']);
Route::post('/refresh', [AuthController::class, 'refresh']);
Route::get('/roles', [RoleController::class, 'index']);

// Protected routes
Route::middleware(['auth:api'])->group(function () {
    
    // Authentication routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/profile/avatar', [AuthController::class, 'updateAvatar']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);
    Route::post('/enable-2fa', [AuthController::class, 'enable2FA']);
    Route::post('/disable-2fa', [AuthController::class, 'disable2FA']);

    // Dashboard
    Route::get('/dashboard/stats', [DashboardController::class, 'getStats']);
    Route::get('/dashboard/recent-activities', [DashboardController::class, 'getRecentActivities']);

    // Projects
    Route::apiResource('projects', ProjectController::class);
    Route::post('/projects/{id}/assign-team-lead', [ProjectController::class, 'assignTeamLead']);
    Route::get('/projects/{id}/stats', [ProjectController::class, 'getStats']);

    // Project Comments
    Route::get('/projects/{id}/comments', [ProjectCommentController::class, 'index']);
    Route::post('/projects/{id}/comments', [ProjectCommentController::class, 'store']);
    Route::put('/project-comments/{id}', [ProjectCommentController::class, 'update']);
    Route::delete('/project-comments/{id}', [ProjectCommentController::class, 'destroy']);

    // Teams
    Route::apiResource('teams', TeamController::class);
    Route::post('/teams/{id}/add-member', [TeamController::class, 'addMember']);
    Route::delete('/teams/{id}/remove-member/{userId}', [TeamController::class, 'removeMember']);
    Route::get('/teams/{id}/members', [TeamController::class, 'getMembers']);
    Route::get('/teams/{id}/stats', [TeamController::class, 'getStats']);

    // Rooms
    Route::apiResource('rooms', RoomController::class);
    Route::post('/rooms/{id}/join', [RoomController::class, 'joinRoom']);
    Route::post('/rooms/{id}/leave', [RoomController::class, 'leaveRoom']);

    // Tasks
    Route::apiResource('tasks', TaskController::class);
    Route::patch('/tasks/{id}/status', [TaskController::class, 'updateStatus']);
    Route::patch('/tasks/{id}/progress', [TaskController::class, 'updateProgress']);
    Route::get('/tasks/kanban/board', [TaskController::class, 'getKanbanBoard']);
    Route::patch('/tasks/{id}/move', [TaskController::class, 'moveTask']);
    
    // Task Comments
    Route::post('/tasks/{id}/comments', [TaskCommentController::class, 'store']);
    Route::get('/tasks/{id}/comments', [TaskCommentController::class, 'index']);
    Route::put('/comments/{id}', [TaskCommentController::class, 'update']);
    Route::delete('/comments/{id}', [TaskCommentController::class, 'destroy']);

    // Task Attachments
    Route::post('/tasks/{id}/attachments', [TaskAttachmentController::class, 'store']);
    Route::get('/tasks/{id}/attachments', [TaskAttachmentController::class, 'index']);
    Route::delete('/attachments/{id}', [TaskAttachmentController::class, 'destroy']);
    Route::get('/attachments/{id}/download', [TaskAttachmentController::class, 'download']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications', [NotificationController::class, 'store']);
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::patch('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);

    // Reports
    Route::get('/reports/projects', [ReportController::class, 'projectReports']);
    Route::get('/reports/teams', [ReportController::class, 'teamReports']);
    Route::get('/reports/tasks', [ReportController::class, 'taskReports']);
    Route::get('/reports/users', [ReportController::class, 'userReports']);
    Route::get('/reports/charts', [ReportController::class, 'getDashboardCharts']);
    Route::post('/reports/export/pdf', [ReportController::class, 'exportPDF']);
    Route::post('/reports/export/excel', [ReportController::class, 'exportExcel']);

    // Notifications
    Route::get('/notifications/unread-count', [NotificationController::class, 'getUnreadCount']);

    // User management
    // Read: allowed for all authenticated users, filtering is handled inside UserController@index/show
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'show']);

    // Write operations still protected by RBAC permissions
    Route::middleware(['role.permission:users,create'])->group(function () {
        Route::post('/users', [UserController::class, 'store']);
    });

    Route::middleware(['role.permission:users,update'])->group(function () {
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::patch('/users/{id}/status', [UserController::class, 'updateStatus']);
    });

    Route::middleware(['role.permission:users,delete'])->group(function () {
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
    });

    // Role management (Super Admin only)
    Route::prefix('admin/rbac')->group(function () {
        // Role management
        Route::get('/roles', [RoleController::class, 'index']);
        Route::get('/roles/{id}', [RoleController::class, 'show']);
        Route::post('/roles', [RoleController::class, 'store']);
        Route::put('/roles/{id}', [RoleController::class, 'update']);
        Route::delete('/roles/{id}', [RoleController::class, 'destroy']);
        
        // Permission management
        Route::get('/roles/{id}/permissions', [RoleController::class, 'getRolePermissions']);
        Route::post('/roles/{id}/permissions', [RoleController::class, 'assignPermissions']);
        Route::delete('/roles/{id}/permissions', [RoleController::class, 'removePermissions']);
        
        // User role assignment
        Route::get('/roles/{id}/users', [RoleController::class, 'getRoleUsers']);
        Route::post('/roles/{roleId}/assign-user', [RoleController::class, 'assignRoleToUser']);
        
        // Permission endpoints
        Route::get('/permissions', [PermissionController::class, 'index']);
        Route::post('/permissions', [PermissionController::class, 'store']);
        Route::get('/permissions/{id}', [PermissionController::class, 'show']);
        Route::put('/permissions/{id}', [PermissionController::class, 'update']);
        Route::delete('/permissions/{id}', [PermissionController::class, 'destroy']);
        Route::get('/permissions/category/{category}', [PermissionController::class, 'getByCategory']);
        Route::post('/permissions/bulk-create', [PermissionController::class, 'bulkCreate']);
        
        // Statistics and matrix
        Route::get('/permission-matrix', [RoleController::class, 'getPermissionMatrix']);
        Route::get('/statistics', [RoleController::class, 'getStatistics']);
        Route::get('/permission-statistics', [PermissionController::class, 'getStatistics']);
    });

    // Categories (Client hierarchy)
    Route::get('/categories/tree', [CategoryController::class, 'tree']);
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
});
