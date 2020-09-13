function aggregateArray(original, you, exp) {
  let aggregates = [];
  let copy = original.slice(0);
  for (let i = 0; i < original.length; i++) {
    let count = 0;
    let youGroup = false;
    let expGroup = false;
    if (you.has(original[i])) {
      youGroup = true;
    }
    if (exp.has(original[i])) {
      expGroup = true;
    }
    for (let j = 0; j < copy.length; j++) {
      if (original[i] === copy[j]) {
        count++;
        delete copy[j];
      }
    }
    if (count > 0) {
      aggregates.push({'value': original[i], 'count': count, 'you': youGroup, 'expert': expGroup});
    }
  }
  return aggregates;
}

function categoryOf(trait) {
  return trait.split('/')[0];
}

function aggregateTraits(original) {
  let aggregates = [];
  let copy = [];
  for (let i = 0; i < original.length; i++) {
    copy.push(original[i].value);
  }
  console.log(copy);
  for (let i = 0; i < original.length; i++) {
    let count = 0;
    let category = categoryOf(original[i].value);
    for (let j = 0; j < copy.length; j++) {
      if (copy[j] && categoryOf(copy[j]) === category) {
        count = count + original[j].count;
        console.log(category + " adding " + original[j].count);
        delete copy[j];
      }
    }
    if (count > 0) {
      aggregates.push({'value': categoryOf(original[i].value), 'count': count});
    }
  }
  aggregates.forEach(cat => {
    cat.detail = [];
    original.forEach(trait => {
      if (cat.value === categoryOf(trait.value)) {
        cat.detail.push(trait);
      }
    });
  })
  return aggregates;
}

function compare(a, b) {
  return b.count - a.count;
}

function parseAroma(reports) {
  let aromas = [];
  let exp = new Set();
  let you = new Set();

  for (let i = 0; i < reports.length; i++) {
    for (let j = 0; j < reports[i].aroma.aromas.length; j++) {
      let trait = reports[i].aroma.aromas[j].trait;
      if ("Not Found" !== trait) {
        aromas.push(trait);
        if (reports[i].cat === 'you')
          you.add(trait);
        else if (reports[i].cat === 'expert')
          exp.add(trait);
      }
    }
  }
  let ret = aggregateArray(aromas, you, exp);
  ret.sort(compare);
  console.log(ret);
  ret = aggregateTraits(ret);
  ret.sort(compare);
  return ret;
}

function parseFlavor(reports) {
  let flavors = [];
  let exp = new Set();
  let you = new Set();
  for (let i = 0; i < reports.length; i++) {
    for (let j = 0; j < reports[i].flavor.flavors.length; j++) {
      let trait = reports[i].flavor.flavors[j].trait;
      if ("Not Found" !== trait) {
        flavors.push(trait);
        if (reports[i].cat === 'you')
          you.add(trait);
        else if (reports[i].cat === 'expert')
          exp.add(trait);
      }
    }
  }
  let ret = aggregateArray(flavors, you, exp);
  ret.sort(compare);
  console.log(ret);
  ret = aggregateTraits(ret);
  ret.sort(compare);
  return ret;
}

export {parseAroma, parseFlavor}
