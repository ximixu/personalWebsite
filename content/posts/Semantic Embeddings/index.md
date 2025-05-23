+++
author = ["Xiao Xu"]
title = "Playing With Semantic Embeddings"
date = "2025-05-22"
tags = [
    "codeday",
    "memetics",
]
+++
As part of this CodeDay memetics internship, [we're supposed to get started with semantic embeddings.](https://dev.to/omar4ur/open-source-semantic-embedding-search-clustering-in-nodejs-23om)However, after completing this quick tutorial, I felt like it might be more interesting to do this with a slightly larger dataset. Given that this is a memetics internship it felt appropriate to use data from Twitter, the website currently known as X.

Since I'm not going to pay for API access or publicly violate Twitter's TOS, I'll get some tweets from [community archive](community-archive.org). The easiest way for me to do this is just to get all the tweets from one user as a .json from object storage, so I'm just going to use the example provided in the docs at
[fabxmporizzqflnftavs.supabase.co/storage/v1/object/public/archives/defenderofbasic/archive.json](https://fabxmporizzqflnftavs.supabase.co/storage/v1/object/public/archives/defenderofbasic/archive.json)
```
import json
with open('archive.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
tweets_raw = data.get("tweets", [])
tweets_text = []
for tweet in tweets_raw:
    tweets_text.append(tweet["tweet"].get("full_text", ""))
for i in range(5):
    print(tweets_text[i])
```
And this gives the output:
```
@RichardCovetous [https://t.co/knqLMreP9F](https://t.co/knqLMreP9F)
...i guess this is also known as "making your own company &amp; contracting out to a big company"
i would split big tech salary in half with someone if we can trade off working for 6 months and keep each other updated &amp; ramped up
@nosilverv big accounts need chat moderators like on twitch. It's a really easy way to add value / grow your own following (if you understand the person's tweets &amp; can explain it to the drive by people). It's different types of work
@banterrealism what would my digital clone say to yours, what would the second half of your tweet history say to your first half etc [https://t.co/RjVHUyRs4d](https://t.co/RjVHUyRs4d)
```
Looks good!

Now to generate the embeddings, I use [all-MiniLM-L6-v2](sentence-transformers/all-MiniLM-L6-v2 · Hugging Face](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2):
```
from sentence_transformers import SentenceTransformer
model = SentenceTransformer('all-MiniLM-L6-v2')
embeddings = model.encode(tweets_text)
```
Using these embeddings, I first tried to cluster tweets together so I could use an LLM to describe the clusters, but I ran into an issue where I just couldn't seem to get reasonably sized clusters out of the data. That's probably an issue on my end, but for now I'll just implement semantic similarity search instead:
```
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

query = "memetics"
k = 10
query_embedding = model.encode([query], convert_to_numpy=True)[0]

similarities = cosine_similarity([query_embedding], embeddings)[0]
top_indices = np.argsort(similarities)[-k:][::-1]  # Sort descending
top_tweets = [tweets_text[i] for i in top_indices]
for i, tweet in enumerate(top_tweets, 1):
    print(f"{i}. {tweet}\n")
```
And this outputs:
```
1. this is so clever, memetic fence? [https://t.co/5D1FAwpp7T](https://t.co/5D1FAwpp7T)

2. next step: generate this list for everyone in the Twitter Community Archive, then make a list of everyone who tweets about "Memetic Dynamics" and "Restless Pursuit of Meaning" so we can all be friends [https://t.co/uDMFRCcoT4](https://t.co/uDMFRCcoT4) [https://t.co/kRCYpVwsL9](https://t.co/kRCYpVwsL9)

3. I'm telling you open source memetic engineering has got to be the way. It wasn't safe at any other point in history, but maybe, maybe we're at a point now where we can (and need to)?

4. in a discord channel named "culture science", they whisper their secrets of memetic propagation dynamics: [https://t.co/ylfVzTKLpF](https://t.co/ylfVzTKLpF)

5. @forthrighter @Alphiloscorp @AbstractFairy added this as a comment to my "narrative spears" article! I think this sort of memetic engineering works better when it's true/useful/flexible

(I think we can keep doing this, come up with a theory on what works, and see which attempts are successful)

[https://t.co/V5BgwKorR4](https://t.co/V5BgwKorR4)

6. @liz_love_lace What's that imgui paradigm again...?

7. The core principle of my "memetic engineering" is this: I (personally) cannot know more or care more about the person than they can of themselves. They are the ultimate arbiter of what is good for them.

8. It doesn't have to be mimetic warfare. Why not mimetic Olympics

9. you can discover things by experimenting on yourself (like memetic engineering), cc @taijitu_sees

[https://t.co/LNUENXoyWL](https://t.co/LNUENXoyWL)

10. @leo_guinan Memetic economist!
```
Neat! 