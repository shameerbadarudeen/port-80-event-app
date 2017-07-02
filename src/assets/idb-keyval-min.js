! function () {
  "use strict";

  function e() {
    return t || (t = new Promise(function (e, n) {
      var t = indexedDB.open("keyval-store", 1);
      t.onerror = function () {
        n(t.error)
      }, t.onupgradeneeded = function () {
        t.result.createObjectStore("keyval")
      }, t.onsuccess = function () {
        e(t.result)
      }
    })), t
  }

  function n(n, t) {
    return e().then(function (e) {
      return new Promise(function (r, o) {
        var u = e.transaction("keyval", n);
        u.oncomplete = function () {
          r()
        }, u.onerror = function () {
          o(u.error)
        }, t(u.objectStore("keyval"))
      })
    })
  }
  var t, r = {
    get: function (e) {
      var t;
      return n("readonly", function (n) {
        t = n.get(e)
      }).then(function () {
        return t.result
      })
    },
    set: function (e, t) {
      return n("readwrite", function (n) {
        n.put(t, e)
      })
    },
    "delete": function (e) {
      return n("readwrite", function (n) {
        n["delete"](e)
      })
    },
    clear: function () {
      return n("readwrite", function (e) {
        e.clear()
      })
    },
    keys: function () {
      var e = [];
      return n("readonly", function (n) {
        (n.openKeyCursor || n.openCursor).call(n).onsuccess = function () {
          this.result && (e.push(this.result.key), this.result["continue"]())
        }
      }).then(function () {
        return e
      })
    }
  };
  "undefined" != typeof module && module.exports ? module.exports = r : "function" == typeof define && define.amd ? define("idbKeyval", [], function () {
    return r
  }) : self.idbKeyval = r
}();

