#!/bin/sh
set -e

# Ensure storage directories exist and have proper permissions
PUBLIC_DISK_ROOT="${PUBLIC_DISK_ROOT:-storage/app/public}"
mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs "$PUBLIC_DISK_ROOT"
chmod -R 775 storage bootstrap/cache 2>/dev/null || true
chmod 775 "$PUBLIC_DISK_ROOT"

# Create storage symlink if not already present
php artisan storage:link --no-interaction

# Run database migrations if enabled (defaults to true)
if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
    echo "Running database migrations..."
    php artisan migrate --force --no-interaction || echo "Warning: Migration failed or database not ready yet."
fi

# Optimize Laravel cache for production if enabled
if [ "${APP_ENV:-production}" = "production" ]; then
    echo "Optimizing configuration and route cache..."
    php artisan config:cache || true
    php artisan route:cache || true
    php artisan view:cache || true
fi

PORT="${PORT:-8080}"
echo "Starting Laravel server on port ${PORT}..."
exec php -S 0.0.0.0:${PORT} -t public
