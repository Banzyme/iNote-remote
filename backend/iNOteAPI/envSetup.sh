#! bin/bash
echo "Checking docker version..."
docker --version

echo "Installing docker-compose..."
sudo curl -L "https://github.com/docker/compose/releases/download/1.22.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

echo "Verifying docker-compose installation..."
docker-compose --version
