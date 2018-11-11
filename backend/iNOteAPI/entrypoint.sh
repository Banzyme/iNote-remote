#! bin/bash
./manage.py shell -c "from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@example.com', 'adminpass')"

echo "Preparing django application"
python3 manage.py makemigrations && python3 manage.py migrate && python3 manage.py runserver 0.0.0.0:5000 --settings=events.settings
echo "Running migrations complete, starting application.."
