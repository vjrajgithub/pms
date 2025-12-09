<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResourceAccess extends Model
{
    use HasFactory;

    protected $table = 'resource_access';

    protected $fillable = [
        'resource_type',
        'resource_id',
        'created_by',
        'owner_id',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    // Relationships
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    // Scopes
    public function scopeByType($query, $type)
    {
        return $query->where('resource_type', $type);
    }

    public function scopeCreatedBy($query, $userId)
    {
        return $query->where('created_by', $userId);
    }

    public function scopeOwnedBy($query, $userId)
    {
        return $query->where('owner_id', $userId);
    }

    // Helper Methods
    public static function recordAccess($resourceType, $resourceId, $userId, $ownerId = null, $metadata = null)
    {
        return self::create([
            'resource_type' => $resourceType,
            'resource_id' => $resourceId,
            'created_by' => $userId,
            'owner_id' => $ownerId ?? $userId,
            'metadata' => $metadata,
        ]);
    }

    public static function isCreatedBy($resourceType, $resourceId, $userId)
    {
        return self::byType($resourceType)
            ->where('resource_id', $resourceId)
            ->where('created_by', $userId)
            ->exists();
    }

    public static function isOwnedBy($resourceType, $resourceId, $userId)
    {
        return self::byType($resourceType)
            ->where('resource_id', $resourceId)
            ->where('owner_id', $userId)
            ->exists();
    }
}
