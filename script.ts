
class TrieNode {
    children: { [key: string]: TrieNode };
    // children["a"] = TrieNode()
    isEndOfWord: boolean;
  
    constructor() {
      this.children = {};
      this.isEndOfWord = false;
    }
  }
  
  class Trie {
    root: TrieNode;
  
    constructor() { //init
      this.root = new TrieNode(); //Empty trie
    }
  
    //Insert word in trie node
    insert(word: string): void {
      //Start frim the root and then go character by character
      let currentNode = this.root;
      //So what is happened here is you go char by char and ask is this char exist
      for (let i = 0; i < word.length; i++) {
        const char = word[i];
        if (!currentNode.children[char]) { // If char is not in HashMap  create TrieNode for this character
          currentNode.children[char] = new TrieNode();
        }
        //If it exist curr is child and continue for loop
        //Example apple = ape => a & p can simply continue until e for e we need to create new TrieNode   
        currentNode = currentNode.children[char];
      }
      //Just mark character which is end of the word
      //apE => e will be true, amazoN => N will be end of the  
      currentNode.isEndOfWord = true;
    }
  
    surroundWordsWithPTag(text: string): string {
      let newText = '';
      let currentNode = this.root;
      let currentWord = '';
      let lastIndex = 0; // Last index is here just to know where to insert new word. We will remove old word and inser new one with <p>
  
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (currentNode.children[char]) {
          //Root will become letter, first letter will become second letter etc. 
          //Current node will be A => P => P => L => E
          currentNode = currentNode.children[char];
          //currentWord Will be A => AP => APP => APPL => APPLE 
          currentWord += char;
          if (currentNode.isEndOfWord) {//If this is last letter
            //Inser current word which is sorround wit <p> tag in new text 
            newText += text.slice(lastIndex, i - currentWord.length + 1) + '<p>' + currentWord + '</p>';
            //Reset everything 
            lastIndex = i + 1;
            currentNode = this.root;
            currentWord = '';
          }
        } else {
          currentNode = this.root;
          currentWord = '';
        }
      }
  
      newText += text.slice(lastIndex);
      return newText;
    }
  
    private _searchFromIndex(
      text: string,
      index: number,
      node: TrieNode,
      currentWord: string,
      foundWords: Set<string>
    ): void {
      if (index >= text.length || !node.children[text[index]]) return;
      const nextNode = node.children[text[index]];
      const nextWord = currentWord + text[index];
      if (nextNode.isEndOfWord) {
        foundWords.add(nextWord);
      }
      this._searchFromIndex(text, index + 1, nextNode, nextWord, foundWords);
    }
  
    search(text: string): string[] {
      const foundWords = new Set<string>();
      for (let i = 0; i < text.length; i++) {
        this._searchFromIndex(text, i, this.root, '', foundWords);
      }
      return Array.from(foundWords);
    }
  
    
  }
  
  
  
  const text = "This is very good morning, very nice and very warm. I would like to have one nice cup of coffee, and that coffee can contains sugar. But very good morning and very good coffee makes me happy";
  const words = ["morning", "coffee"];
  
  
  const trie = new Trie();
  words.forEach(word => trie.insert(word));
  const newText = trie.surroundWordsWithPTag(text);
  
  console.log(newText);
  