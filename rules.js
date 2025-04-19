// Jimmy Luu

class Start extends Scene {
    create() {
        // Initialize player state (inventory and discoveries)
        this.engine.storyState = {};
        // This is used to set the title
        this.engine.setTitle(this.engine.storyData.Title);
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        // We use storyData to get the initial location of the story
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation);
    }
}

class Location extends Scene {
    create(key) {
        // From the key we use we get current location data
        let locationData = this.engine.storyData.Locations[key];
        this.engine.show(locationData.Body); // Show the location body text

        // Handle any discoveries (e.g., codeword, hidden path)
        if (locationData.Reveals) {
            for (let [_, discoveryValue] of Object.entries(locationData.Reveals)) {
                this.engine.storyState["discovered:" + discoveryValue] = true;
            }
        }

        // Handle any items given at this location (e.g., GuardUniform)
        if (locationData.ItemGiven) {
            this.engine.storyState["has:" + locationData.ItemGiven] = true;
        }

        // Add valid choices based on requirements
        let added = false;
        if (locationData.Choices && locationData.Choices.length > 0) {
            // First pass: add choices meeting all requirements
            for (let choice of locationData.Choices) {
                let meetsDiscovery = true;
                let meetsItem = true;
                if (choice.RequiresDiscovery && !this.engine.storyState["discovered:" + choice.RequiresDiscovery]) {
                    meetsDiscovery = false;
                }
                if (choice.RequiresItem && !this.engine.storyState["has:" + choice.RequiresItem]) {
                    meetsItem = false;
                }
                if (meetsDiscovery && meetsItem) {
                    this.engine.addChoice(choice.Text, choice);
                    added = true;
                }
            }
            // Fallback: if no choices added, allow those without requirements
            if (!added) {
                for (let choice of locationData.Choices) {
                    if (!choice.RequiresDiscovery && !choice.RequiresItem) {
                        this.engine.addChoice(choice.Text, choice);
                    }
                }
            }
        } else {
            // This is The End, that's it :D
            this.engine.addChoice("The end.");
        }
    }

    handleChoice(choice) {
        if (choice) {
            this.engine.show("&gt; " + choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits1);
        this.engine.show(this.engine.storyData.Credits2);
        if (this.engine.storyData.Edited) {
            this.engine.show(this.engine.storyData.Edited);
        }
    }
}

// This will load the engine with the story data
Engine.load(Start, 'myStory.json');
