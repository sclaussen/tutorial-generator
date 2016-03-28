This package is intended to be used to generate a sample tutorial that
builds in phases.

To use geneg:

1. Create a prep directory to contain the various phases.
1. Create a 00 directory and add a README.md there that will be used across all phases.
1. Create the first phase as 01/ and add any files required in that state (other then the README.md).
1. Create the rest of the states in a similar fashion (e.g. 02/, 03/, ..., 10/, 11/, et al).
1. Run geneg providing the source directory and a target directory as parameters.

For example, here's a sample prep structure:

<pre>
/sample-source/00/README.md
/sample-source/01/file1
/sample-source/02/file1 (modified from phase 01)
/sample-source/02/file2
/sample-source/03/file1 (modified from phase 02)
/sample-source/03/file2 (modified from phase 02)
/sample-source/03/file3
</pre>

Execute geneg (currently must be in the geneg package as this is a
work in progress):

<pre>
$ cd geneg
$ node geneg ../sample-source ../sample-target
</pre>

Now change into the target directory and you will see the files from
the 00 directory (README.md in this case).  If you do a git log though
you'll see commits for each phase of the tutorial each tagged with the
phase number.

<pre>
$ git log --pretty=format:%C(yellow)%h  %Cblue%ad  %Creset%s%Cgreen  [%cn] %Cred%d --decorate --date=short
f1e372d  2016-03-28  Commit for start  [Shane Claussen]  (HEAD -> master, tag: start)
c5d18e2  2016-03-28  Commit for step 03  [Shane Claussen]  (tag: 03)
4d868da  2016-03-28  Commit for step 02  [Shane Claussen]  (tag: 02)
9320f6c  2016-03-28  Commit for step 01  [Shane Claussen]  (tag: 01)
5d2ff83  2016-03-28  Commit for step 00  [Shane Claussen]  (tag: 00)
</pre>

In the README.md file you can now instruct readers to move between
phases using:

<pre>
$ git checkout 01 -f
$ git checkout 02 -f
$ git checkout 03 -f
</pre>
