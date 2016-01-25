var express = require('express');
var router = express.Router();
var r = require('rethinkdb');

/* GET /*model */
router.get('/:model/', function(req, res) {
  r.table(req.params.model).orderBy({
    index: "createdAt"
  })
  .run(req._rdbConn, function(error, cursor) {
    if (error) {
      handleError(res, error)
    } else {
      // Retrieve all the models in an array
      cursor.toArray(function(error, result) {
        if (error) {
          handleError(res, error)
        } else {
          // Send back the data
          res.status(200).send(result);
        }
      });
    }
  });

});

/* POST /*model */
router.post('/:model/', function(req, res) {
  var model = req.body; // req.body was created by `bodyParser`
  model.createdAt = r.now(); // Set the field `createdAt` to the current time

  r.table(req.params.model).insert(model, {
    returnChanges: true
  }).run(req._rdbConn, function(error, result) {
    if (error) {
      handleError(res, error)
    } else if (result.inserted !== 1) {
      handleError(res, new Error("Document was not inserted."))
    } else {
      res.status(200).send(result.changes[0].new_val);
    }
  });

});

/* PUT /*model */
router.put('/:model/', function(req, res) {
  var model = req.body;
  if ((model != null) && (model.id != null)) {
    r.table(req.params.model).get(model.id).update(model, {
      returnChanges: true
    }).run(req._rdbConn, function(error, result) {
      if (error) {
        handleError(res, error)
      } else {
        res.status(200).send(result.changes[0].new_val);
      }
    });

  } else {
    handleError(res, new Error("The model must have a field `id`."))
  }

});

/* DELETE /*model */
router.delete('/:model/', function(req, res) {
  var model = req.body;
  if ((model != null) && (model.id != null)) {
    r.table(req.params.model).get(model.id).delete().run(req._rdbConn, function(error, result) {
      if (error) {
        handleError(res, error)
      } else {
        res.status(200).send(result);
      }
    });

  } else {
    handleError(res, new Error("The model must have a field `id`."))
  }

});

function handleError(res, error) {
  return res.status(500).send({
    error: error.message
  });

}

module.exports = router;
