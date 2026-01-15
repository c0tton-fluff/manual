- Today's challenge is a very interesting one and new to me
- Recently, I came across a very helpful addition in testing APIs
- Definitely worth getting it! - https://gist.github.com/jhaddix/daba27d11fdd97d9077d610dccbe91df
	- It is invaluable in testing and uncovers many hidden paths
    - Super easy to save too:
        - Copy the script and save a new tab
        - Instead of URL you paste in the script, name it, and you are good to go
        - When testing, just click on it and it will take few seconds and spit out a nice page for you

## Enumeration

- As usual, we can check the way the website works and how it behaves
- It is the good old trusted typing practice

![Daily](/BugForge/img/Sokudo-01.png)

- Since there is not much functionality apart from the practice, we can check what is BurpSuite showing

![Daily](/BugForge/img/Sokudo-02.png)

- First thing to notice is the `/v2/login` ... if there is a v2 ... there definitely used to be `/v1`

![Daily](/BugForge/img/Sokudo-03.png)

- This confirms it
- With the helpful script mentioned before, we can enumerate more without guessing

## Endpoint checker

- `Endpoints Found: 21`

![Daily](/BugForge/img/Sokudo-04.png)

- This is interesting
- Apart from the `/v1`, we also find multiple `/v2` endpoints with `admin` and `flag`
- Now the question is how we can get there
- I thought this was as simple as this ...

![Daily](/BugForge/img/Sokudo-05.png)

- I knew it felt too easy ...

### JWT token

- I tried multiple `/v2` ways but was not able to move forward
- I tried with `/v1` since I felt this could be at least worth to test

![Daily](/BugForge/img/Sokudo-06.png)

- I simply used the token I had and of course it did not work, but this time, I knew `JSON Web Token` option in Burp was open

![Daily](/BugForge/img/Sokudo-07.png)

- With this I have tried to abuse it in the simplest way, by changing the `role` from `user` to `admin`
- That still did not work

![Daily](/BugForge/img/Sokudo-08.png)

- This time I thought of two things ... either changing the `"id": 4` or simply changing `alg : none`
- The `id = 1` worked like a charm

![Daily](/BugForge/img/Sokudo-09.png)

### MCP attempt

- Here I wanted to see the approach from MCP server within Burp
- I gave it some options but wanted to see how far it can take me

![Daily](/BugForge/img/Sokudo-10.png)

![Daily](/BugForge/img/Sokudo-11.png)

![Daily](/BugForge/img/Sokudo-12.png)

- It struggled to find a way in...

![Daily](/BugForge/img/Sokudo-13.png)

- I was still a firm believer it was able to accomplish it, even thought I felt it started to go away from the goal, more trying to overcomplicate its own existence ...

![Daily](/BugForge/img/Sokudo-14.png)

- At some point though, it started to show some promise!

![Daily](/BugForge/img/Sokudo-15.png)

- Found its limitation and helped it with the token I have already created previously 

![Daily](/BugForge/img/Sokudo-16.png)

- When given a hand, it was able to work it out ...
- The whole MCP journey for me with Burp is brand new and I see its huge potential for sure!

![Daily](/BugForge/img/Sokudo-17.png)

- Keep learning and be useful! 
