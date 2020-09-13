<script>
  import Tabs from "./comp/Tabs.svelte";
  import Load from "./Load.svelte";
  import User from "./User.svelte";
  import BoxGroupPlot from "./comp/BoxGroupPlot.svelte";
  import {parseAroma, parseFlavor} from "./js/Aggregate";

  let user;
  let userRank = undefined;
  let entry;

  let judges = {
    you: [],
    others: [],
    experimented: []
  }

  let files = {
    accepted: [],
    rejected: []
  };

  let reports = [];

  let tabItems = [
    {label: "Load", shortLabel: "L", value: 1, comment: ''},
    {label: "User", shortLabel: "U", value: 2, comment: ''},
    {label: "Score", shortLabel: "S", value: 3, comment: ''},
    {label: "Aroma", shortLabel: "A", value: 4, comment: ''},
    {label: "Flavor", shortLabel: "F", value: 5, comment: ''},
  ];
  let currentTab = 1;

  function getDataForYou(f) {
    let ret = []
    judges.you.forEach(r => ret.push(f(r)));
    return ret;
  }

  function getDataForOther(f) {
    let ret = []
    judges.others.forEach(r => ret.push(f(r)));
    return ret;
  }

  function getDataForExperimented(f) {
    let ret = []
    judges.experimented.forEach(r => ret.push(f(r)));
    return ret;
  }

  function getAllData(f) {
    let ret = []
    judges.experimented.forEach(r => ret.push(f(r)));
    judges.you.forEach(r => ret.push(f(r)));
    judges.others.forEach(r => ret.push(f(r)));
    return ret;
  }

  function getScore(r) {
    if (r) return r.score;
    return 0;
  }

  function getAromaScore(r) {
    if (r) return r.aroma.score;
    return 0;
  }

  function getFlavorScore(r) {
    if (r) return r.flavor.score;
    return 0;
  }

  function getMouthfeelScore(r) {
    if (r) return r.mouthfeel.score;
    return 0;
  }

  function getOverallScore(r) {
    if (r) return r.overall.score;
    return 0;
  }

  function getAppearanceScore(r) {
    if (r) return r.appearance.score;
    return 0;
  }


</script>

<style>
    :global(custom-dropzone) {
    }
span.expert {
    font-style: italic;
}
</style>

<Tabs bind:activeTabValue={currentTab} items={tabItems}/>
{#if 1 === currentTab}
  <h2>Load PDF Scoresheets</h2>
  <Load files={files} bind:reports={reports} bind:currentTab={currentTab} bind:entry={entry}/>
{:else if 2 === currentTab}
  <h2>Choose a User</h2>
  <User reports={reports} bind:user={user} bind:rankr={userRank} bind:currentTab={currentTab} judges={judges}/>

  <BoxGroupPlot title="All" you={getAllData(getScore)}
                others={[]}
                experimented={[]}/>

{:else if 3 === currentTab}
  <h2>Compare Score for {user}</h2>
  <h3>Score 50</h3>
  <BoxGroupPlot title="Score" you={getDataForYou(getScore)} others={getDataForOther(getScore)}
                experimented={getDataForExperimented(getScore)}/>
  <h3>Flavor 20</h3>
  <BoxGroupPlot title="Flavor" you={getDataForYou(getFlavorScore)}
                others={getDataForOther(getFlavorScore)}
                experimented={getDataForExperimented(getFlavorScore)}/>
  <h3>Aroma 12</h3>
  <BoxGroupPlot title="Aroma" you={getDataForYou(getAromaScore)}
                others={getDataForOther(getAromaScore)}
                experimented={getDataForExperimented(getAromaScore)}/>
  <h3>Overall 10</h3>
  <BoxGroupPlot title="Overall" you={getDataForYou(getOverallScore)}
                others={getDataForOther(getOverallScore)}
                experimented={getDataForExperimented(getOverallScore)}/>
  <h3>Mouthfeel 5</h3>
  <BoxGroupPlot title="Mouthfeel" you={getDataForYou(getMouthfeelScore)}
                others={getDataForOther(getMouthfeelScore)}
                experimented={getDataForExperimented(getMouthfeelScore)}/>
  <h3>Appearance 3</h3>
  <BoxGroupPlot title="Appearance" you={getDataForYou(getAppearanceScore)}
                others={getDataForOther(getAppearanceScore)}
                experimented={getDataForExperimented(getAppearanceScore)}/>
{:else if 4 === currentTab}
  <h2>Compare Aromas for {user}</h2>

    {#each parseAroma(reports) as item}
    <h3>{item.value} ({item.count})</h3>
    <ul>
      {#each item.detail as detail}
        <li>{detail.count} {detail.value}
          {#if detail.expert}
            <b>expert</b>
          {/if}
          {#if detail.you}
            <b>YOU</b>
          {/if}
        </li>
      {/each}
    </ul>
  {/each}
{:else if 5 === currentTab}
  <h2>Compare Flavors for {user}</h2>

  {#each parseFlavor(reports) as item}
    <h3>{item.value} ({item.count})</h3>
    <ul>
      {#each item.detail as detail}
        <li>{detail.count} {detail.value}
          {#if detail.expert}
            <span class="expert">Expert</span>
          {/if}
          {#if detail.you}
            <span class="you">YOU</span>
          {/if}
        </li>
      {/each}
    </ul>
  {/each}
{/if}
