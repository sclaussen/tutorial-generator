This package is intended to be used to generate a sample tutorial that
builds in phases.

To use the tutorial generator:

1. Create a prep directory (eg ./example/source) to contain the various phases of the tutorial.
1. In the prep directory, create a subdirectory named 00 (eg ./example/source/00), and create a README.md there that contains the markdown tutorial.
1. In the prep directory, create another subdirectory naemd 01 (eg ./example/source/01), and add any files required in that phase (other than the README.md).
1. Create the rest of the phases in a similar fashion (e.g. ./02/, ./03/, ..., ./10/, ./11/, et al) adding files into these directories required for those phases.
1. Run the tutorial generator providing the source directory and a target directory as parameters.  The target directory need not exist.
1. When the generator is complete, a git repository will have been created in the target directory with multiple commits, one per each of the phase directories, and each tagged for easy access.

For example, here's a sample prep structure:

<pre>
./source/00/README.md
./source/01/file1
./source/02/file1 (modified from phase 01)
./source/02/file2
./source/03/file1 (modified from phase 02)
./source/03/file2 (modified from phase 02)
./source/03/file3
</pre>

Execute the tutorial generator:

<pre>
$ cd tutorial-generator
$ node index example/source example/target
</pre>

Now change into the target directory and you will see the files from
the 00 directory (README.md in this case).  IMPORTANT: If you execute
a git log though you'll see commits for each phase of the tutorial
each tagged with the phase number.

<pre>
$ git log --pretty=format:%C(yellow)%h  %Cblue%ad  %Creset%s%Cgreen  [%cn] %Cred%d --decorate --date=short
f1e372d  2016-03-28  Commit for start  [Shane Claussen]  (HEAD -> master, tag: start)
c5d18e2  2016-03-28  Commit for step 03  [Shane Claussen]  (tag: 03)
4d868da  2016-03-28  Commit for step 02  [Shane Claussen]  (tag: 02)
9320f6c  2016-03-28  Commit for step 01  [Shane Claussen]  (tag: 01)
5d2ff83  2016-03-28  Commit for step 00  [Shane Claussen]  (tag: 00)
</pre>

In the README.md file containing the tutorial, as you introduce new
phases of your coding sample, you can now instruct readers to move
between the phases by checking out each of the commits using a tag.
For example:

<pre>
$ git checkout 01 -f
$ git checkout 02 -f
$ git checkout 03 -f
</pre>
