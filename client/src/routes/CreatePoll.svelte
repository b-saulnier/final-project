<script>
  import { store } from "./store";


    let title = '';
    let newOption = '';
    let options = [];

    function addOption() {
        // we don't want to add this stuff to the server until the whole poll is completed

        if (newOption === '') {
            alert("Please add an option");
            return;
        }

        options = [...options, newOption];
        console.log("adding new option to options", newOption, options);
        newOption = '';

    }

    async function createPoll() {
        if (options.length === 0 || options.length === 1) {
            return;
        }
        if (title === '') {
            return;
        }


        console.log("createPoll", title, options)
        await fetch(`http://localhost:4003/polls`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                options
            })
        });

        console.log("createPoll now fetching from query")

        // fetch from query service on port 4000
        const response = await fetch(`http://localhost:4000/polls`);
        const data = await response.json();

        // update store
        store.set(data);
        console.log("new store data", data);

        console.log("now resetting title and options");

        title = '';
        options = [];


    }

</script>


<h1>Create a Poll</h1>

<form on:submit={createPoll}>
    <div class="dflex flex-column">
        <label for="title">Title:</label>
        <input class="form-control" id="title" type="text" name="title" bind:value={title} />

        <label for="options">Add options:</label>
        <input class="form-control"
            type="text" name="option" bind:value={newOption} />
        <button class="btn btn-info"
        type="button" on:click={addOption}>Add Option</button>
        

        

        <h3>Title: {title}</h3>
        <p>Options:</p>
        <ul class="list-group-numbered">
            {#each options as option}
                <li class="list-group-item">{option}</li>
            {/each}
        </ul>
        {#if options.length === 0}
            <div class="alert alert-info">
                Please add at least two options.
            </div>
        {/if}


        <button class="btn btn-info"
            type="submit">Create Poll</button>
    </div>

</form>