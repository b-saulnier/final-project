<script>
    import CreatePoll from "./CreatePoll.svelte";
    import PollList from "./PollList.svelte";
    import Restart from "./Restart.svelte";


</script>


<Restart />

<div class="container pt-5">

    <h1>POLL MASTER</h1>

    <div class="row">
        <div class="col-sm-4 border fixed pt-3 pb-3">
            <CreatePoll />
        </div>
        <div class="col-sm-8 border pt-3 pb-3">
            <PollList />
        </div>
        
        
    </div>
</div>


