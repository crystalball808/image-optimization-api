# Image Optimization API
Basic Node.js server for handling image editing requests
# How to use
## Start the server
```bash
npm run dev
```
## Make requests
```bash
curl -X POST -F "image=@/absolute/path/image.jpg" "http://localhost:3000/convert?format=png" --output /absolute/path/converted-image.png
```
