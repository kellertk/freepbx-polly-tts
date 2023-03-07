So, FreePBX ships with Node 8, which is insanely out of date and not even
supported by the AWS JS SDK anymore. The built in way to use the Polly TTS
engine uses very old versions of JS packages to get done what it needs to do and
I think that's silly.

So this is a rewrite in modern TypeScript that's compiled to a single file that
can run on Node 8.
