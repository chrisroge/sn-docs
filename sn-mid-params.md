# MID Server Parameters for PowerShell

## Release version: Xanadu, Washington DC, Vancouver, Utah

*Updated: Jul 31, 2024*

*3 minutes to read*

Parameters control the behavior of a particular MID Server and have lower precedence than MID Server properties. The following parameters are optional.

**Note:** After changing the setting for any parameter, be sure to restart the MID Server service.

| Name | Description |
|------|-------------|
| `mid.powershell_api.session_pool.max_size` | Specifies the maximum number of sessions allowed in the session pool.<br>**Type:** Integer<br>**Default value:** 25 |
| `mid.powershell_api.session_pool.target.max_size` | Specifies the maximum number of sessions allowed in the pool per target host.<br>**Type:** Integer<br>**Default value:** 3 |
| `mid.powershell_api.winrm.use_ssl` | Requires the use of SSL certificates for HTTPS connections using WinRM.<br>**Type:** True \| False<br>**Default value:** false |
| `mid.powershell_api.winrm.additional_pssesion_options` | Controls advanced options for a PSSession. For more information about advanced PSSession options |
| `mid.powershell_api.winrm.remote_https_port` | Configures the port for connecting to Windows servers using PowerShell over HTTPS.<br>**Type:** Integer<br>**Default value:** 5986 |
| `mid.powershell_api.winrm.remote_port` | Configures the port for connecting to Windows servers using PowerShell over HTTP.<br>**Type:** Integer<br>**Default value:** 5985 |
| `mid.powershell_api.winrm.skip_ssl_cert_check` | Skips the SSL certificate check when using WinRM for HTTPS connections.<br>**Type:** True \| False<br>**Default value:** false |
| `mid.powershell_api.winrm.skip_ssl_cert_check_options` | Skips specific SSL certificate checks when using WinRM for HTTPS connections.<br>**Type:** String<br>**Default value:** -SkipCACheck -SkipCNCheck -SkipRevocationCheck |
| `mid.powershell.use_credentials` | Determines the credentials to use for Discovery with PowerShell.<br>**Type:** true \| false<br>**Default value:** true |
| `mid.use_powershell` | Enables or disables PowerShell for Discovery.<br>**Type:** true \| false<br>**Default value:** true |
| `mid.powershell.path` | Enables an administrator to point to a specific PowerShell on a MID Server.<br>**Type:** string (path)<br>**Default value:** none |
| `mid.powershell.enforce_utf8` | Force commands on a target Windows system to return UTF-8 encoded output.<br>**Type:** true \| false<br>**Default value:** true |
| `mid.powershell.local_mid_service_credential_fallback` | Specifies the login credentials the MID Server uses if all other credentials fail.<br>**Type:** True \| False<br>**Default value:** true |
| `mid.powershell_api.idle_session_timeout` | Specifies the timeout value of idle PowerShell sessions in seconds.<br>**Type:** Integer<br>**Default value:** 60 |
| `mid.powershell.command.parameter_passing` | Allow passing PowerShell parameters from the command line.<br>**Type:** True \| False<br>**Default value:** false |
| `mid.powershell.command.script.parameter_passing` | Allow passing PowerShell scripts from the command line.<br>**Type:** True \| False<br>**Default value:** false |
| `mid.windows.management_protocol` | Select the Windows management protocol used for device and process classification.<br>**Type:** String<br>**Default value:** WMI |
| `mid.windows.probe_timeout` | Sets the timeout interval for all Windows probes on a specific MID Server.<br>**Type:** Integer<br>**Default value:** 600 |
