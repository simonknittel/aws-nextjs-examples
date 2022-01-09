# Running the application locally for development

1. Make sure to have [mkcert](https://github.com/FiloSottile/mkcert) installed

   ```sh
   # macOS
   brew install mkcert
   mkcert -install
   ```

   ```powershell
   # Windows (WSL2)
   # 1. Download `.exe` from https://github.com/FiloSottile/mkcert/releases
   .\mkcert-v1.X.X-windows-amd64.exe -install
   ```

2. Create certificates

   ```sh
   # macOS
   mkdir ./https_proxy/certs && mkcert -cert-file ./https_proxy/certs/localhost.crt -key-file ./https_proxy/certs/localhost.key localhost
   ```

   ```powershell
   # Windows (WSL2)
   .\mkcert-v1.X.X-windows-amd64.exe -cert-file localhost.crt -key-file localhost.key localhost
   # 2. Create `certs` directory in `https_proxy`
   # 3. Copy `localhost.crt` and `localhost.key` to `certs` directory
   ```

3. (Windows only) Implement port forwarding

   The `host.docker.internal` in `nginx.local.conf` leads to the Windows host instead of WSL2. Therefore we'll have to add a port forwarding rule to forward port 3000 from the Windows host to WSL2. See <https://github.com/microsoft/WSL/issues/4150> for more information. Caveat: The IP address of the WSL2 may changes and you need to run the following commands again.

   ```powershell
   netsh interface portproxy delete v4tov4 listenport="3000" # Delete any existing port 3000 forwarding
   $wslIp=(wsl -d Ubuntu -e sh -c "ip addr show eth0 | grep 'inet\b' | awk '{print `$2}' | cut -d/ -f1") # Get the private IP of the WSL2 instance
   netsh interface portproxy add v4tov4 listenport="3000" listenaddress="127.0.0.1" connectaddress="$wslIp" connectport="3000" # Create new port forwarding rule
   ```

4. Start the Next.js application

   ```sh
   npm run dev
   ```

5. Start the https reverse proxy (nginx)

   ```sh
   docker compose up
   ```

6. Now access your local application via <https://localhost:8443>
