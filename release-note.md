Xpell Release Notes

- Bi-directional Wormholes
- add XNanoCommands for firing events + data example:
  - fire event: "myEvent" data: "myData"
  - change xuiobject base display to "flex" instead of "block"
  - xui-core-objects fix super constructor calls
  - XObject debug mode
- XObject debug mode: add _debug property to XObject, log method for debugging
- XObject _debug property: allows enabling debug mode for the XObject, which logs messages
- XObject log method: logs messages if _debug is true, includes type and id of the XObject
- Xlogger debug method: added debug method to XLogger for logging debug messages
- XObject support nano commands in HTML event handlers
