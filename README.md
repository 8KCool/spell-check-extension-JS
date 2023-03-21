
### Summary 
Grammarly and other tools don’t identify typos from names and companies that can only be known from context. For instance, in an email chain, a user writes “Caitlin” as their name, and is then addressed as “Caitlyn” in a subsequent e-mail, Grammarly won’t recognize the error. 

We are building a Chrome extension to specifically identify typos from e-mails 

## Metrics for Success 

● # of people that try the Chrome Extension
● Words corrected 
Feature Spec V0:
● Identifies misspelled words 
● Underlines words in red
Has no technical errors in console
Feature Spec V1:

When a word is selected, it should be highlighted.  When the user selects something else, it should not be highlighted
The suggestion UI should pop up below the word (see Figma)..  Users should be able to either a) ignore the suggestion, or a) implement the suggestion and have the misspelled word be changed

##Designs

https://www.figma.com/file/m9y4KmN57OnnrPJqqfNBNd/icantspell?node-id=0%3A1&t=AqMhLhlmDbYuMd1v-1

### V0 Feature Requirements: 

Back-end should a) generate a list of words that are not regular words in the dictionary via scanning the first email.  It should NOT flag words that are common nouns.  It should not require any hard-code to do this.  It should work agnostic of puncutation, i.e words next to an exclamation pt, quotation marks, or a period should all work.
E.g “This is an email with some regular words and some nouns that could be spelled incorrectly. For instance, the name Sasha, the company Zorba, and the name Karoush, could be misspelled incorrectly.” → [“Sasha”,”Zorba, “Karoush”]
“This is another email.  Here is a random sentence. I like catchup with my hamburgers, but I do not like it with my sushi. Now, let’s add in a couple words that could be misspelled in this scenario: a company named Substrounge, the name Isaac, and a name like Suri.  -> [“Isaac,” “Isaac”,”Suri”]
Words in the second email that are possibly misspelled, i.e have the same starting and finish letter and same length as words in 1, should be flagged as mis-spelled via being underlined in red.
The plugin should be able to run automatically and check every incremental word added to the email, ie listen to words that are newly typed
### V1 Feature Requirements:
When a mispelled word is selected, it should be highlighted.  When it is not selected, ie a user clicks on another part of the e-mail it should not be highlighted.
A UI window should appear below the highlight (see FIgma) that allows users to implement the suggested fix.  
Users should be able to a) fix the word via implementing the suggestion, or b) ignore the suggestion.

### Code Requirements
Ever function should have a clear name describing what the method does
Ever function should have the runtime O(1), O(N), O(N^2)
Every function should have an annotation describing what the inputs and outputs are of the function
Every function should have 2 clear examples of what the inputs and outputs are

### Other Questions: 
What is the chance for false positive (i.e identify words that are spelled incorrectly? How might we mitigate this?


