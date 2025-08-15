# MMM
a mystery adventure involving MCP

## 🕵️ Main Story:"Murder at Château de Verre"
In the misty hills of Provence, the grand Château de Verre stands as a relic of aristocratic opulence. It’s 1923, and the mansion hosts a lavish soirée to celebrate the return of famed explorer Lucien Moreau, who has just returned from a perilous expedition in Egypt. But as the clock strikes midnight, Lucien is found dead in his study—poisoned wine in hand, a cryptic note beside him:“The past always returns.”

The guests are trapped in the mansion due to a storm. You, the player, take on the role of an investigator connected to the MCP Server. Your mission: collect clues (resources), ask the right questions (prompt templates), and take decisive actions to uncover the murderer before dawn.

<div>
<img src="./images/bg.png" alt="Background image, chateau de Verre, 1920" width=600>

</div>

## 🏰 Setting: Château de Verre Rooms: 

- Study (crime scene) 
- Library (clues)
- Conservatory (secret meetings)
- Cellar (hidden passage)
- Ballroom (alibis)
- Servants’ Quarters (eavesdropping).

Atmosphere: Candlelit halls, thunder outside, ticking clocks, and whispers of betrayal.

## 🧠 Game Mechanics (TypeScript + MCP Server)
Clue Collection: Use MCP to fetch resources (e.g., diary entries, letters, fingerprints).

### Prompt Templates: Ask questions like:

```python
ask_character("Éloise Moreau", "Where were you at midnight?");
ask_Character("Henri Duval", "Do you recognize this poison?");
```

### Actions:

```python
take_action("Search Study");
take_action("Analyze Wine Glass");
take_action("Confront Madeleine Rousseau");
```

MCP Context Protocol: Each clue updates the context window. You must manage context size and relevance to avoid losing critical information.

## playing it

**Via VS Code**

```json
"my-mcp-server-c9913e11": {
    "type": "stdio",
    "command": "python",
    "args": ["/workspaces/MMM/src/python/server.py"]
}
```

**Using the client**

```sh
cd src/python/server.py
python client.py
```

**Website**

Start `index.html` in `/src`


TIP: you might need to install "mcp[cli]".


## TODO 


- todo: accuse button, accuse person with item, if correct, they confess
if incorrect, they will give angry response
items can only be selected from list
todo: display clue, for a room if character has a clue
  o when an item is selected, you can select to pick them up
  o create an inventory of items
  o if you click "accuse" your list of inventory items should be shown
  o if guilty person + correct murder weapon is combined then you will get confession

- preload all assets before game starts
- create mini images of people and items

- can we add animations in places
- can we add a list of characters to the starter page?