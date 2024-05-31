# Variables
LOCAL_BUILD_DIR=dist
REMOTE_USER=pi
REMOTE_HOST=192.168.50.148
REMOTE_DIR=/var/www/fretboard

# Step 1: Build the React project
echo "Building the React project..."
npm run build

# Step 2: Transfer the build files to the Raspberry Pi
echo "Transferring files to the Raspberry Pi..."
scp -r $LOCAL_BUILD_DIR/* $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR

# Step 3: Restart Nginx on the Raspberry Pi
echo "Restarting Nginx on the Raspberry Pi..."
ssh $REMOTE_USER@$REMOTE_HOST "sudo systemctl restart nginx"

echo "Deployment complete!"