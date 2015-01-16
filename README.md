resolveRelink
======

Take reference loop handeled in the way Json.Net handles and recreates the objects preserving the references on the client. It also creates the references in the same way

Example
===
Here's an object crated from json using Json.Net
```
var arr = _.relink(JSON.parse("[{"$id":1,"Name":"SammyD"},{"$ref":1}]"));
arr[0].Name= "Sam";
arr[1].Name;

//=>"Sam"
```
The Object reference has been relinked.
It will replace the entire object graph going deep into objects

It can also relink it for sending it back to the server.

```
JSON.Stringify(_.resolve(arr));
//=> "[{"$id":1,"Name":"Sam"},{"$ref":1}]"
```
Again it searches the object graph and replaces the objects with references
