<?php

namespace App\Models;

use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;

class Project extends Model
{
    public const STATUSES = ['Planning', 'In Progress', 'On Hold', 'Completed'];
    public const PRIORITIES = ['Low', 'Medium', 'High'];

    protected $fillable = [
        'client_name',
        'project_name',
        'description',
        'status',
        'priority',
        'start_date',
        'due_date',
    ];

    protected $hidden = ['id'];

    protected $appends = ['public_id'];

    protected $casts = [
        'start_date' => 'date:Y-m-d',
        'due_date'   => 'date:Y-m-d',
    ];

    public function getPublicIdAttribute(): string
    {
        $encrypted = Crypt::encryptString((string) $this->getKey());

        return rtrim(strtr(base64_encode($encrypted), '+/', '-_'), '=');
    }

    public function resolveRouteBinding($value, $field = null)
    {
        $encrypted = base64_decode(
            strtr($value, '-_', '+/') . str_repeat('=', (4 - strlen($value) % 4) % 4),
            true,
        );

        if ($encrypted === false) {
            return null;
        }

        try {
            $id = Crypt::decryptString($encrypted);
        } catch (DecryptException) {
            return null;
        }

        if (!ctype_digit($id)) {
            return null;
        }

        return parent::resolveRouteBinding($id, $field);
    }
}
