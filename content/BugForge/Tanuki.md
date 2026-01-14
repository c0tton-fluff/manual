Today's daily challenge is a straightforward one, but I used BurpSuite with MCP server to solve as it as I am trying to learn and understand the AI impact.

![](Pasted%20image%2020260114095455.png)

# Recon 

- We get a landing page, so as usual we can register
![](Pasted%20image%2020260114095516.png)

- The best way to check for web application vulnerabilities is to simply use it, not automatically search for them
- Majority of the time, we can observe something out of the ordinary while simply clicking through and checking the responses from the application/server

![](Pasted%20image%2020260114095529.png)

- After browsing decks, we can add them to dashboard and `Start Studying`

- This pretty much gives us all of the functionality of the website, we can continue now within BurpSuite

## BurpSuite

- Any time we see `GET` request and numbers within, it would be **rude** not to play around and check

![](Pasted%20image%2020260114095549.png)

- In this case, I approached it different ... as I have my MCP connected to Burp, I used `codex` to help me solve this and see whether there is a good way to showcase AI usage.

### MCP BurpSuite

- I asked first to give me an idea whether it can find anything within the HTTP history of Burp, as I clicked around the page, based on the `hint`

![](Pasted%20image%2020260114095606.png)

- The suggestion was taken literally, so that one was on me :)
- Next, I asked to dig deeper and see whether there is something meaningful that we can use
- It was very adamant about the `42 Socket.IO event`, I had to politely ask to change approach

![](Pasted%20image%2020260114095616.png)

- Since I have observed the `API stats` before with the `GET`, I redirected its brain there

![](Pasted%20image%2020260114095625.png)

- It was able to run tests and found the correct way to get the flag

![](Pasted%20image%2020260114095635.png)

- Thank you for reading, my first (of many to come) published writeup! 
- Keep Learning and Be Useful! 


