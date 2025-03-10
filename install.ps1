# Check if Docker is installed
    if (-Not (Get-Command docker -ErrorAction SilentlyContinue)) {
      Write-Host "Docker is not installed. Please install Docker Desktop first."
      exit 1
    }

    # Check if Docker is running
    $dockerRunning = docker info -ErrorAction SilentlyContinue
    if ($LASTEXITCODE -ne 0) {
      Write-Host "Docker is not running. Please start Docker Desktop."
      exit 1
    }

    # Check for Dockerfile
    if (-Not (Test-Path "Dockerfile")) {
      Write-Host "Dockerfile not found in the current directory."
      exit 1
    }

    # Build Docker image
    Write-Host "Building Docker image..."
    docker build -t my-app .

    if ($LASTEXITCODE -ne 0) {
      Write-Host "Failed to build Docker image."
      exit 1
    }

    # Run Docker container
    Write-Host "Starting Docker container..."
    docker run -d --name my-app-container my-app

    if ($LASTEXITCODE -ne 0) {
      Write-Host "Failed to start Docker container."
      exit 1
    }

    Write-Host "Installation completed successfully!"
