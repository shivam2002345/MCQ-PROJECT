// controllers/questionController.js
const technologyModel = require('../models/technologyModel');
const questionModel = require('../models/questionModel');

const getQuestionCounts = async (req, res) => {
    try {
        // Fetch all technologies
        const technologies = await technologyModel.getAllTechnologies();

        // Count questions for each technology
        const questionCounts = await Promise.all(
            technologies.map(async (tech) => {
                // Fetch all questions for the specific technology ID
                const count = await questionModel.getQuestionCountByTechId(tech.tech_id);
                return { tech_id: tech.tech_id, tech_name: tech.tech_name, question_count: count };
            })
        );

        res.json(questionCounts);
    } catch (error) {
        console.error('Error fetching question counts:', error);
        res.status(500).json({ error: 'Error fetching question counts' });
    }
};

module.exports = {
    getQuestionCounts,
};
