// Jimmy Luu

class Start extends Scene {
    create() {
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
        this.engine.show(locationData.Body); // This will show the location body text

        if (locationData.Choices && locationData.Choices.length > 0) {
            // Loop over all choices that you have so north or south.
            for (let choice of locationData.Choices) {
                // Use the choice text and pass the whole choice to handleChoice
                this.engine.addChoice(choice.Text, choice);
            }
        } else {
            // This is The End, thats it :D
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
        this.engine.show(this.engine.storyData.Credits);
        this.engine.show(this.engine.storyData.Edited);
    }
}

// This will load the the engine with the story data
Engine.load(Start, 'myStory.json');
