const { Pool } = require("pg");
const services = require("./services");
const stores = require("./stores");
const database = require("./database");

module.exports.handler = async (event) => {
  const pool = new Pool(database.db);
  try {
    stores.forEach(async (store) => {
      const stores = await pool.query("SELECT * FROM stores WHERE name = $1", [
        `${store.name}`,
      ]);
      const storeSelected = stores.rows[0];
      const response = await services(store.url);
      const removeInitial = response.data.indexOf(
        "[",
        response.data.indexOf("[") + 1
      );
      const formatedReviews = JSON.parse(
        response.data.substring(removeInitial).slice(0, -1)
      );
      formatedReviews.map(async (element, index) => {
        //pegar a pessoa
        const personName = element[0][1][4][2][1];
        // console.log("pessoa que comentou =>", personName);

        //pegar comentário
        const reviewText = element[0][2].pop().shift().shift();
        // console.log("comentário =>", reviewText);

        const values = [reviewText, personName, storeSelected.name];
        const insertReviewQuery = `
          INSERT INTO reviews (review_text, person_name, store_id)
          VALUES ($1, $2, (SELECT stores_id FROM stores WHERE name = $3))
          RETURNING *;
          `;
        await pool.query(insertReviewQuery, values);
      });
    });

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "Realizado com sucesso!",
        },
        null,
        2
      ),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify(
        {
          message: "erro ao consultar dados, tente novamente mais tarde!",
          err: error,
        },
        null,
        2
      ),
    };
  }
};
