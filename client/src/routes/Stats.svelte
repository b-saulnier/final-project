<script>
    export let option = "";
    export let poll = {};

    // so the stats data should be included in the query service, so it should already exist

    let total = Object.values(poll.options).reduce((a, b) => a + b, 0);
    console.log("total", total, poll.options);
    let percent = parseFloat(100 * poll.options[option]/total).toFixed(2)+"%";
    console.log("percent", percent);
    
</script>


<div>
    <span class="badge bg-secondary">{percent}</span>
    <span class="badge bg-secondary">{poll.options[option]}</span>
</div>

<div>
    <div class="progress">
        <div class="progress-bar" style="width:{percent}"></div>
    </div>
</div>