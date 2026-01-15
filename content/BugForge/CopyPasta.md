Today's challenge: Broken Access Control

![Daily](/BugForge/img/copy-01.png)

## Enumeration

- We can register as usual
- As normal, we can click around the page to find more of the functionality 

![Daily2](/BugForge/img/copy-02.png)

- Continuing enumeration, we switch over to the Burp MCP and let it run to find issues

![Daily3](/BugForge/img/copy-03.png)

## MCP

- It went on to test all sorts...
![Daily4](/BugForge/img/copy-04.png)
![Daily5](/BugForge/img/copy-05.png)

- Again, I had to ask it to laser focus on what it was searching for
- Previously finding api/snippets/1 made me think to check those out so this is where I asked Burp MCP to focus

![Daily6](/BugForge/img/copy-06.png)

- Now that I asked it to rethink the actions, and not only use the snippets to change numbers but also methods like `PUT`and `DELETE`
- It did not take long for it to find the culprit

![Daily7](/BugForge/img/copy-07.png)

- Keep learning and be useful! 
