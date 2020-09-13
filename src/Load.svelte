<script>
  import Dropzone from "svelte-file-dropzone";

  export let files;
  export let reports;
  export let currentTab;
  export let entry;

  function handleFilesSelect(e) {
    const {acceptedFiles, fileRejections} = e.detail;
    files.accepted = [...files.accepted, ...acceptedFiles];
    files.rejected = [...files.rejected, ...fileRejections];
  }

  function handleRemoveFile(e, index) {
    files.accepted.splice(index, 1);
    files.accepted = [...files.accepted];
  }

  function handleRemoveAll() {
    files.accepted = [];
  }

  function process() {
    reports.length = 0;
    files.accepted.forEach(file => readPdf(file));
    currentTab = 2;
    reports = reports;
  }

  function readPdf(file) {
    let fr = new FileReader();
    fr.onload = function (e) {
      try {
        parsePDF(e.target.result, file);
      } catch (err) {
        console.warn(err);
      }
    };
    fr.readAsText(file);
  }

  function parsePDF(text, file) {
    if (!text.startsWith('%PDF-1.3')) {
      throw ("Not a PDF Scoresheet file: " + file.name);
    }
    var lines = text.split('\n');
    for (var i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('/Keywords (')) {
        let json = lines[i].slice(11, -1)
        if (!json.startsWith('{')) {
          json = unescape(json);
        }
        let jsonObject = JSON.parse(json);
        const currentEntry = jsonObject.beer.entry + ':' + jsonObject.beer.category;
        if (! entry) {
          entry = currentEntry;
        }
        else if (entry !== currentEntry) {
          console.warn("Skipping " + file.name + " entry is " + currentEntry + " expecting " + entry);
          // TODO: remove filtering
          // return;
        }
        // TODO skip scoresheet where all sections are incomplete or with 0 score?
        // TODO only keep the most recent report for a user
        jsonObject.filename = file.name;
        reports.push(jsonObject);
        reports = reports;
        console.log("Adding " + file.name + " entry " + entry);
        return;
      }
    }
    throw ("Not a Scoresheet file: " + file);
  }

</script>

<style>
  :global(custom-dropzone) {
  }
</style>

<Dropzone on:drop={handleFilesSelect} accept="application/pdf" multiple={true} containerClass="custom-dropzone">
  <button>Choose PDF Scoresheets</button>
  <p>or</p>
  <p>Drag and drop them here</p>
</Dropzone>

<button on:click={() => process()} disabled={files.accepted.length === 0}>Process</button>

<div style="margin: 5px;">
  {#if files.accepted.length > 0}
    <button on:click={handleRemoveAll}>RemoveAll</button>
  {/if}
  {#each files.accepted as item, index}
    <div>
      <span>{item.name}</span>
      <button on:click={e => handleRemoveFile(e, index)}>Remove</button>
    </div>
  {/each}
</div>

