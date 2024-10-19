class Question {
  constructor(pool) {
    this.pool = pool;
  }

  // Insert questions into the PostgreSQL table
  async insertQuestions(questions) {
    const query = `
      INSERT INTO questions (tech_id, level_id, question_text, option_a, option_b, option_c, option_d, correct_option) 
      VALUES ($1, $2, $3, $4, $5, $6, $7)`;

    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');
      for (const question of questions) {
        const { tech_id, level_id, question_text, option_a, option_b, option_c, option_d, correct_option } = question;
        // Insert without `id` since it will be auto-generated
        await client.query(query, [tech_id, level_id, question_text, option_a, option_b, option_c, option_d, correct_option]);
      }
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = Question;
