// Node class for Trie
class TrieNode {
    constructor() {
        this.children = new Map();
        this.isEndOfWord = false;
    }
}

// Trie class
class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word) {
        let node = this.root;
        for (const char of word) {
            if (!node.children.has(char)) {
                node.children.set(char, new TrieNode());
            }
            node = node.children.get(char);
        }
        node.isEndOfWord = true;
    }

    print() {
        const result = [];
        this._printRecursive(this.root, '', result);
        return result.join('\n');
    }

    _printRecursive(node, prefix, result) {
        if (node.isEndOfWord) {
            result.push(prefix);
        }

        for (const [char, childNode] of node.children) {
            this._printRecursive(childNode, prefix + char, result);
        }
    }
}

// Usage
const trie = new Trie();

// Insert some data into the trie
const words = ['banana','apple', 'app', 'apricot', 'bat'];
for (const word of words) {
    trie.insert(word);
}

// Print the trie
console.log(trie.print());