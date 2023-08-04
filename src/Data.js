class Data {
  constructor() {
    this.data = require('../assets/data/data.json');
    this.passwords = require('../assets/data/passwords.json');
  }

  getBuckets() {
    var bucketsRows = [];
    for (var i = 0; i < this.data.buckets.length; i+=2) {
      var curentBucket = this.data.buckets[i];
      var nextBucket = this.data.buckets[i+1]||{"title": false, "icon": false, "id": false, "code": false};
      bucketsRows.push({firstTitle: curentBucket.title, firstIcon: curentBucket.icon, firstId: curentBucket.id, firstLocked: Boolean(curentBucket.code), secondTitle: nextBucket.title, secondIcon: nextBucket.icon, secondId: nextBucket.id, secondLocked: Boolean(nextBucket.code)});
    }
    return bucketsRows;
  }

  getBucketsWCodeList() {
    var buckets = [];
    for (var i = 0; i < this.data.buckets.length; i++) {
      if (this.data.buckets[i].code)
        buckets.push(this.data.buckets[i]);
    }
    return buckets
  }

  getModules(parentId) {
    var modules = [];
    for (var i = 0; i < this.data.modules.length; i++) {
      if (parseInt(this.data.modules[i].parentId) === parseInt(parentId))
        modules.push(this.data.modules[i]);
    }
    return modules;
  }

  getModule(id) {
    for (var i = 0; i < this.data.modules.length; i++) {
      if (parseInt(this.data.modules[i].moduleId)===parseInt(id))
        return this.data.modules[i];
    }

  }

  getDecksByModule(id) {
    var decks = [];
    for (var i = 0; i < this.data.decks.length; i++) {
      if (parseInt(this.data.decks[i].moduleId) === parseInt(id))
        decks.push(this.data.decks[i]);
    }
    return decks;

  }

  getModuleIdByDeckId(deckId) {
    for (var i = 0; i < this.data.decks.length; i++) {
      if (parseInt(this.data.decks[i].id) === parseInt(deckId))
        return this.data.decks[i].moduleId
    }
    return 1
  }

  getDeck(deckId) {
    for (var i = 0; i < this.data.decks.length; i++) {
      if (parseInt(this.data.decks[i].id) === parseInt(deckId))
        return this.data.decks[i];
    }
  }

  auth(user, pass) {
    let found = false;
    this.passwords.forEach((row) => {
      if (user === row.user && pass === row.pass) {
        found = true;
      }
    });
    return found;
  }


}

export default Data;
