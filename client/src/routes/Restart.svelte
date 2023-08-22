<script>

    async function restart() {
        await fetch(`http://localhost:4000/restart`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({})
        });



    }

</script>


<button on:click={restart}>Restart</button>
