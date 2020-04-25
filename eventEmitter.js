const EventEmitter = (function() {
  class EventEmitter {
    /**
     * Constructor.
     *
     * @constructor
     *
     * Set private initial parameters:
     *   _events, _callbacks.
     *
     * @return {this}
     */
    constructor() {
      this._events = new Set();
      this._callbacks = {};

      return this;
    }

    /**
     * Add callback to the event.
     *
     * @param {string} eventName.
     * @param {function} callback
     * @param {object|null} context - In than context will be called callback.
     * @param {number} weight - Using for sorting callbacks calls.
     *
     * @return {this}
     */
    _addCallback(eventName, callback, context, weight) {
      this._getCallbacks(eventName)
        .push({
          callback,
          context,
          weight
        });

      // Sort the array of callbacks in
      // the order of their call by "weight".
      this._getCallbacks(eventName)
        .sort((a, b) => b.weight - a.weight);

      return this;
    }

    /**
     * Get all callback for the event.
     *
     * @param {string} eventName
     *
     * @return {object|undefined}
     */
    _getCallbacks(eventName) {
      return this._callbacks[eventName];
    }

    /**
     * Get callback's index for the event.
     *
     * @param {string} eventName
     * @param {callback} callback
     *
     * @return {number|null}
     */
    _getCallbackIndex(eventName, callback) {
      return this._has(eventName) ?
        this._getCallbacks(eventName)
          .findIndex(element => element.callback === callback) : -1;
    }

    /**
     * Check if callback is already exists for the event.
     *
     * @param {string} eventName
     * @param {function} callback
     * @param {object|null} context - In than context will be called callback.
     *
     * @return {bool}
     */
    _callbackIsExists(eventName, callback, context) {
      const callbackInd = this._getCallbackIndex(eventName, callback);
      const activeCallback = callbackInd !== -1 ?
        this._getCallbacks(eventName)[callbackInd] : void 0;

      return (callbackInd !== -1 && activeCallback &&
        activeCallback.context === context);
    }

    /**
     * Check is the event was already added.
     *
     * @param {string} eventName
     *
     * @return {bool}
     */
    _has(eventName) {
      return this._events.has(eventName);
    }

    /**
     * Add the listener.
     *
     * @param {string} eventName
     * @param {function} callback
     * @param {object|null} context - In than context will be called callback.
     * @param {number} weight - Using for sorting callbacks calls.
     *
     * @return {this}
     */
    on(eventName, callback, context = null, weight = 1) {
      if (typeof callback !== 'function') {
        throw new TypeError(`${callback} is not a function`);
      }

      // If event wasn't added before - just add it
      // and define callbacks as an empty object.
      if (!this._has(eventName)) {
        this._events.add(eventName);
        this._callbacks[eventName] = [];
      } else {
        // Check if the same callback has already added.
        if (this._callbackIsExists(...arguments)) {
          this._console.warn(`Event "${eventName}"` +
            ` already has the callback ${callback}.`);
        }
      }

      this._addCallback(...arguments);

      return this;
    }

    /**
     * Remove an event at all or just remove selected callback from the event.
     *
     * @param {string} eventName
     * @param {function} callback
     *
     * @return {this}
     */
    off(eventName, callback = null) {
      let callbackInd;

      if (this._has(eventName)) {
        if (callback === null) {
          // Remove the event.
          this._events.delete(eventName);
          // Remove all listeners.
          _callbacks[eventName] = null;
        } else {
          callbackInd = this._getCallbackIndex(eventName, callback);

          if (callbackInd !== -1) {
            this._getCallbacks(eventName).splice(callbackInd, 1);
            // Remove all equal callbacks.
            this.off(...arguments);
          }
        }
      }

      return this;
    }

    /**
     * Trigger the event.
     *
     * @param {string} eventName
     * @param {...args} args - All arguments which should be passed into callbacks.
     *
     * @return {this}
     */
    emit(eventName, ...args) {
      const custom = this._callbacks[eventName];
      // Number of callbacks.
      let i = custom ? custom.length : 0;
      let current;

      while (i--) {
        current = custom[i];

        if (arguments.length > 1) {
          current.callback.call(current.context, args);
        } else {
          current.callback.call(current.context);
        }
      }

      return this;
    }

    /**
     * Clear all events and callback links.
     *
     * @return {this}
     */
    clear() {
      this._events.clear();
      this._callbacks = {};

      return this;
    }
  }

  return EventEmitter;
})();
