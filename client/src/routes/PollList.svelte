<script>
    import { onMount } from "svelte";
    import { store } from "./store.js";
    import Poll from "./Poll.svelte";


    export let polls = {};


    onMount(async () => {
        console.log("onMount");
        const response = await fetch(`http://localhost:4000/polls`);
        const data = await response.json();

        console.log("onMount data", data);

        store.set(data);
    });

    store.subscribe(data => {
        console.log("store subscribe",  data);
        console.log("entries", Object.entries(data));
        polls = data;
    });

    $: entriesArray = Object.entries(polls);
    $: idsArray = entriesArray.map(([id, _]) => id);
    $: pollArray = entriesArray.map(([_, poll]) => poll);
    $: console.log("pollArray", pollArray);
    $: console.log("idsArray", idsArray);



</script>


<!-- lists all the polls -->

<h1>Polls</h1>

{#if pollArray.length !== 0}
    <!-- {@debug} -->
    {#each entriesArray as [id, poll] (id)}
        <Poll {poll} />
    {/each}
{/if}
{#if entriesArray.length === 0}
    <div class="alert alert-info">
        There are no polls yet.
    </div>
{/if}



