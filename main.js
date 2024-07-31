
const EDGE = ".";
const CAP = "#";
const WHISKER = "/";
const EMPTY_SPACES = ["", EDGE, WHISKER, CAP];

var table = {};
var tableElement;

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

function wordFits(x, y, word, down = false)
{
    let tile;
    let touchingEdge = false;

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
                return false;
            }
            touchingEdge = true;
        }
        else if (tile == EDGE)
        {
            if (touchingEdge)
            {
                return false;
            }
            touchingEdge = true;
        }
        else if (!["", word[i]].includes(tile))
        {
            return false;
        }
        else
        {
            touchingEdge = false;
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
                if (getTile(x - 1, y + i) == "")
                {
                    setTile(x - 1, y + i, WHISKER);
                }
            }
            else
            {
                if (getTile(x + 1, y + i) == "")
                {
                    setTile(x + 1, y + i, EDGE);
                }
                if (getTile(x - 1, y + i) == "")
                {
                    setTile(x - 1, y + i, EDGE);
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
                if (getTile(x + i, y - 1) == "")
                {
                    setTile(x + i, y - 1, WHISKER);
                }
            }
            else
            {
                if (getTile(x + i, y + 1) == "")
                {
                    setTile(x + i, y + 1, EDGE);
                }
                if (getTile(x + i, y - 1) == "")
                {
                    setTile(x + i, y - 1, EDGE);
                }
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

function createCrossword(words, maxSizeX, maxSizeY)
{

    table = {};

    words.sort(function(){return 0.5 - Math.random()});

    printWord(0, 0, words.pop());

    let attempts = 0;

    while (words.length > 0 && attempts < 10000)
    {
        let word = words[words.length - 1];
        let found = false;

        for (var letterIndex = 0; letterIndex < word.length; letterIndex++)
        {

            let tableKeys = Object.keys(table);
            tableKeys.sort(function(){return 0.5 - Math.random()});

            for (rootLetterIndex of tableKeys)
            {
                if (table[rootLetterIndex] == word[letterIndex])
                {
                    let rootX = parseInt(rootLetterIndex.split(", ")[0]);
                    let rootY = parseInt(rootLetterIndex.split(", ")[1]);

                    if (wordFits(rootX - letterIndex, rootY, word, false))
                    {
                        printWord(rootX - letterIndex, rootY, words.pop(), false)
                        found = true;
                        break;
                    }
                    if (wordFits(rootX, rootY - letterIndex, word, true))
                    {
                        printWord(rootX, rootY - letterIndex, words.pop(), true)
                        found = true;
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

    if (words.length != 0)
    {
        alert("Couldn't fit " + words)
    }

    let minX = 0;
    let maxY = 0;
    let minY = 0;
    let maxX = 0;

    for (letterIndex of Object.keys(table))
    {
        if (true || ![EDGE, WHISKER, CAP].includes(table[letterIndex]))
        {
            let letterX = letterIndex.split(", ")[0];
            let letterY = letterIndex.split(", ")[1];
            minX = Math.min(minX, letterX);
            maxX = Math.max(maxX, letterX);
            minY = Math.min(minY, letterY);
            maxY = Math.max(maxY, letterY);
        }
    }

    printTable(maxX - minX + 1, maxY - minY + 1, minX, minY);
}
