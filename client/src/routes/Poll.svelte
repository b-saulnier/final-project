<script>
    import Stats from "./Stats.svelte";

    export let poll = {};
    let selectedOption = '';
    let hasVoted = false;

    console.log("poll", poll);

    async function vote() {
        if (selectedOption === '') {
            return;
        }

        console.log("vote", selectedOption);

        await fetch(`http://localhost:4004/polls/${poll.id}/${selectedOption}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });

        poll.options[selectedOption] += 1;
        hasVoted = true;
    }


</script>



<!-- a poll has a title, various radio options or possibly a text response field -->

<div class="container card">
    <h2 class="mt-2">{poll.title}</h2>

    {#each Object.entries(poll.options) as [option, _]}
    <div class="radio">
        <label>
            <input disabled={hasVoted} type="radio" name="option" value={option} bind:group={selectedOption} />
            {option}

            {#if hasVoted}
                <Stats {option} {poll}/>
            {/if}

        </label>
    </div>
    {/each}
    <div class="mb-2">


        <button class="btn btn-info" 
            disabled={hasVoted} type="button" on:click={vote}>Vote</button>

    </div>
    
</div>