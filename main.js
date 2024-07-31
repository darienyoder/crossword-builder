
const EDGE = ".";
const CAP = "#";
const WHISKER = "/";
const EMPTY_SPACES = ["", EDGE, WHISKER, CAP];

const LETTER = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

var table = {};
var tableElement;
var letterFrequency = [];

var minX = 0;
var maxY = 0;
var minY = 0;
var maxX = 0;

function main()
{
    tableElement = document.getElementById("table");

    createCrossword(["Yoder Family", "Vernon", "Darien", "Traci", "Phillip", "Levi", "Rilen", "Danny", "Zoey", "Patricia", "Chrissy", "Scott", "Mark", "Katie", "Eric", "Kent"], 15, 15)
}

function printTable(sizeX, sizeY, originX, originY)
{
    tableElement.innerHTML = "";

    for (var y = 0; y < sizeY; y++)
    {
        let row = document.createElement("tr");
        for (var x = 0; x < sizeX; x++)
        {
            let square = document.createElement("td");
            square.innerHTML = "<div><p>" + getTile(x + originX, y + originY).toUpperCase() + "</p></div>";

            // if (square.innerText == "")
            // {
            //     square.innerText = (x + originX).toString();
            // }

            if (getTile(x + originX, y + originY) == "")
            {
                square.className = "empty-tile";
            }
            else
            {
                if ([EDGE, WHISKER, CAP].includes(getTile(x + originX, y + originY)))
                {
                    square.className = "utility-tile";
                }
                else
                {
                    square.className = "";
                }
            }
            row.appendChild(square);
        }
        tableElement.appendChild(row);
    }
    if (sizeX / sizeY >= document.getElementsByTagName("main")[0].offsetWidth / document.getElementsByTagName("main")[0].offsetHeight)
    {
        tableElement.style.width = "100%";
        // table.style.height = (sizeY / sizeX * document.getElementsByTagName("main")[0].offsetWidth / document.getElementsByTagName("main")[0].offsetHeight * 100).toString() + "%";
    }
    else
    {
        // table.style.width = (sizeX / sizeY * document.getElementsByTagName("main")[0].offsetWidth / document.getElementsByTagName("main")[0].offsetHeight * 100).toString() + "%";
        tableElement.style.height = "100%";
    }
    tableElement.style.aspectRatio = (sizeX / sizeY).toString();
    document.getElementById("table-style").innerHTML = "td { font-size: " + (tableElement.offsetHeight / sizeY * 0.9).toString() + "px;} table { border-spacing: " + (tableElement.offsetHeight / sizeY / 25).toString() + "px;}"
}

function setTile(x, y, char)
{
    // table[x.toString() + ", " + y.toString()] = char;
    table[x.toString() + ", " + y.toString()] = char;
    if (!EMPTY_SPACES.includes(char))
    {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
    }
}

function getTile(x, y)
{
    // return table[y][x];
    let key = x.toString() + ", " + y.toString()
    if (Object.keys(table).includes(key))
    {
        return table[x.toString() + ", " + y.toString()];
    }
    else
    {
        return "";
    }
}

function setTileVisual(x, y, char)
{
    tableElement.children[y].children[x].innerHTML = "<p>" + char + "</p>";
}

function countAdjacentTiles(x, y)
{
    let count = 0;
    if (!EMPTY_SPACES.includes(getTile(x + 1, y)))
    {
        count++;
    }
    if (!EMPTY_SPACES.includes(getTile(x - 1, y)))
    {
        count++;
    }
    if (!EMPTY_SPACES.includes(getTile(x, y + 1)))
    {
        count++;
    }
    if (!EMPTY_SPACES.includes(getTile(x, y - 1)))
    {
        count++;
    }
    return count;
}

function wordFits(x, y, word, down = false)
{

    if (countAdjacentTiles(x, y) > 1)
    {
        return false;
    }

    let tile;
    let touchingEdge = false;
    let passing = false;

    for (var i = 0; i < word.length; i++)
    {
        if (down)
        {
            tile = getTile(x, y + i);
        }
        else
        {
            tile = getTile(x + i, y);
        }

        if (tile == WHISKER)
        {
            if (i == 0 || i == word.length - 1)
            {
                if (down)
                {
                    if (!EMPTY_SPACES.includes(getTile(x + 1, y + i)) || !EMPTY_SPACES.includes(getTile(x - 1, y + i)))
                    {
                        return false;
                    }
                }
                else
                {
                    if (!EMPTY_SPACES.includes(getTile(x + i, y + 1)) || !EMPTY_SPACES.includes(getTile(x + i, y - 1)))
                    {
                        return false;
                    }
                }
            }
            if (touchingEdge)
            {
                if (!passing || countAdjacentTiles(x + i * (1-down), y + i * +down) > 1)
                {
                    return false;
                }
            }
            touchingEdge = true;
            passing = true;
        }
        else if (tile == EDGE)
        {
            if (touchingEdge)
            {
                if (!passing || countAdjacentTiles(x + i * (1-down), y + i * +down) > 1)
                {
                    return false;
                }
            }
            touchingEdge = true;
            passing = false;
        }
        else if (tile == word[i])
        {
            if (touchingEdge)
            {
                if (passing && countAdjacentTiles(x + i * (1-down), y + i * +down) > 1)
                {
                    return false;
                }
            }
            touchingEdge = true;
            passing = true;
        }
        else if (tile == "")
        {
            touchingEdge = false;
            passing = false;
        }
        else
        {
            return false;
        }
    }

    if (down)
    {
        if (!EMPTY_SPACES.includes(getTile(x, y - 1)) || !EMPTY_SPACES.includes(getTile(x, y + word.length)))
        {
            return false;
        }
    }
    else
    {
        if (!EMPTY_SPACES.includes(getTile(x - 1, y)) || !EMPTY_SPACES.includes(getTile(x + word.length, y)))
        {
            return false;
        }
    }
    return true;
}

function printWord(x, y, word, down = false)
{
    for (var i = 0; i < word.length; i++)
    {
        if (down)
        {
            setTile(x, y + i, word[i]);
            if (i == 0 || i == word.length - 1)
            {
                if (getTile(x + 1, y + i) == "")
                {
                    setTile(x + 1, y + i, WHISKER);
                }
                else if (EMPTY_SPACES.includes(getTile(x + 1, y + i)))
                {
                    setTile(x + 1, y + i, CAP);
                }
                if (getTile(x - 1, y + i) == "")
                {
                    setTile(x - 1, y + i, WHISKER);
                }
                else if (EMPTY_SPACES.includes(getTile(x - 1, y + i)))
                {
                    setTile(x - 1, y + i, CAP);
                }
            }
            else
            {
                if (getTile(x + 1, y + i) == "")
                {
                    setTile(x + 1, y + i, EDGE);
                }
                else if (EMPTY_SPACES.includes(getTile(x + 1, y + i)))
                {
                    setTile(x + 1, y + i, CAP);
                }
                if (getTile(x - 1, y + i) == "")
                {
                    setTile(x - 1, y + i, EDGE);
                }
                else if (EMPTY_SPACES.includes(getTile(x - 1, y + i)))
                {
                    setTile(x - 1, y + i, CAP);
                }
            }
        }
        else
        {
            setTile(x + i, y, word[i]);
            if (i == 0 || i == word.length - 1)
            {
                if (getTile(x + i, y + 1) == "")
                {
                    setTile(x + i, y + 1, WHISKER);
                }
                else if (getTile(x + i, y + 1) == WHISKER)//(EMPTY_SPACES.includes(getTile(x + i, y + 1)))
                {
                    setTile(x + i, y + 1, CAP);
                }
                if (getTile(x + i, y - 1) == "")
                {
                    setTile(x + i, y - 1, WHISKER);
                }
                else if (getTile(x + i, y + 1) == WHISKER)//(EMPTY_SPACES.includes(getTile(x + i, y + 1)))
                {
                    setTile(x + i, y - 1, CAP);
                }
            }
            else
            {
                if (getTile(x + i, y + 1) == "")
                {
                    setTile(x + i, y + 1, EDGE);
                }
                // else if (EMPTY_SPACES.includes(getTile(x + i, y + 1)))
                // {
                //     setTile(x + i, y + 1, CAP);
                // }
                if (getTile(x + i, y - 1) == "")
                {
                    setTile(x + i, y - 1, EDGE);
                }
                // else if (EMPTY_SPACES.includes(getTile(x + i, y - 1)))
                // {
                //     setTile(x + i, y - 1, CAP);
                // }
            }
        }
    }
    if (down)
    {
        setTile(x, y - 1, CAP);
        setTile(x, y + word.length, CAP);
    }
    else
    {
        setTile(x - 1, y, CAP);
        setTile(x + word.length, y, CAP);
    }
}

function createCrossword(wordList, maxSizeX, maxSizeY)
{

    for (var i = 0; i < 26; i++)
    {
        letterFrequency[i] = 0;
    }
    for (word in wordList)
    {
        wordList[word] = wordList[word].toUpperCase();
        for (letter of wordList[word])
        {
            letterFrequency[LETTER.indexOf(letter)] += 1;
        }
    }

    let frequencyOrder = [];
    for (var i = 25; i > -1; i--)
    {
        let maxFrequency = Math.max(...letterFrequency);
        frequencyOrder[i] = LETTER[letterFrequency.indexOf(maxFrequency)];
    }

    let wordScore = {};
    for (word in wordList)
    {
        wordScore[wordList[word]] = 0;
        for (letter of wordList[word])
        {
            let rarity = frequencyOrder.indexOf(letter);
            if (rarity < 3)
            {
                wordScore[wordList[word]] += 6;
            }
            else if (rarity < 6)
            {
                wordScore[wordList[word]] += 5;
            }
            else if (rarity < 10)
            {
                wordScore[wordList[word]] += 4;
            }
            else if (rarity < 14)
            {
                wordScore[wordList[word]] += 3;
            }
            else if (rarity < 18)
            {
                wordScore[wordList[word]] += 2;
            }
            else if (rarity < 22)
            {
                wordScore[wordList[word]] += 1;
            }
            else
            {
                // wordScore[wordList[word]] += 0;
            }
        }
    }

    let words;
    let wordCount;

    while (true)
    {
        words = wordList.slice(0);
        wordCount = 0;

        table = {};
        minX = 0;
        maxY = 0;
        minY = 0;
        maxX = 0;

        words.sort(function(a, b){return wordScore[a] * (0.9 + Math.random() * 0.1) - wordScore[b] * (0.9 + Math.random() * 0.1) });

        printWord(0, 0, words.pop());
        wordCount += 1;

        let attempts = 0;


        while (words.length > 0 && attempts < 10000)
        {
            let word = words[words.length - 1];
            let found = false;

            let sortedLetters = new Array(word.length);
            for (var i = 0; i < sortedLetters.length; i++)
            {
                sortedLetters[i] = i;
            }
            sortedLetters.sort(function(a, b){return frequencyOrder.indexOf(word[b] + Math.random() * 5) - frequencyOrder.indexOf(word[a]) + Math.random() * 5 });

            for (var letterIndex = 0; letterIndex < word.length; letterIndex++)
            {

                let tableKeys = Object.keys(table);
                tableKeys.sort(function(){return 0.5 - Math.random()});

                for (rootLetterIndex of tableKeys)
                {
                    if (table[rootLetterIndex] == word[sortedLetters[letterIndex]])
                    {
                        let rootX = parseInt(rootLetterIndex.split(", ")[0]);
                        let rootY = parseInt(rootLetterIndex.split(", ")[1]);

                        if (wordFits(rootX - sortedLetters[letterIndex], rootY, word, false))
                        {
                            printWord(rootX - sortedLetters[letterIndex], rootY, words.pop(), false)
                            found = true;
                            wordCount += 1;
                            break;
                        }
                        if (wordFits(rootX, rootY - sortedLetters[letterIndex], word, true))
                        {
                            printWord(rootX, rootY - sortedLetters[letterIndex], words.pop(), true)
                            found = true;
                            wordCount += 1;
                            break;
                        }
                    }
                }
                if (found)
                {
                    break;
                }
            }
            if (!found)
            {
                attempts += 1;
            }
        }
        if (wordCount >= wordList.length * 1.0 && (maxSizeX == 0 || maxX - minX + 1 <= maxSizeX) && (maxSizeY == 0 || maxY - minY + 1 <= maxSizeY))
        {
            break;
        }
    }

    if (words.length != 0)
    {
        alert("Couldn't fit " + words)
    }

    // let minX = 0;
    // let maxY = 0;
    // let minY = 0;
    // let maxX = 0;
    //
    // for (letterIndex of Object.keys(table))
    // {
    //     if (true || ![EDGE, WHISKER, CAP].includes(table[letterIndex]))
    //     {
    //         let letterX = letterIndex.split(", ")[0];
    //         let letterY = letterIndex.split(", ")[1];
    //         minX = Math.min(minX, letterX);
    //         maxX = Math.max(maxX, letterX);
    //         minY = Math.min(minY, letterY);
    //         maxY = Math.max(maxY, letterY);
    //     }
    // }

    printTable(maxX - minX + 1, maxY - minY + 1, minX, minY);
}
