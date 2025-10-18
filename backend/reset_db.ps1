Write-Host "Resetting database completely..."

Write-Host "1. Dropping and recreating database..."
psql -h localhost -p 8080 -U postgres -c "DROP DATABASE IF EXISTS hotel_db;"
psql -h localhost -p 8080 -U postgres -c "CREATE DATABASE hotel_db;"

Write-Host "2. Removing migration files..."
$files = Get-ChildItem -Path "reservas\migrations" -Filter "000[1-5]_*.py" -ErrorAction SilentlyContinue
foreach ($file in $files) {
    Remove-Item $file.FullName -Force
}

Write-Host "3. Creating fresh migrations..."
python manage.py makemigrations reservas

Write-Host "4. Applying all migrations..."
python manage.py migrate

Write-Host "5. Loading initial data..."
python manage.py init_data

Write-Host "Database reset complete!"
Pause
