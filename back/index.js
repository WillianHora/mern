const express = require('express');
const mongoose = require('mongoose');

const server = express();
server.use(express.json());

const mongoURI = 'mongodb://localhost:27017/willfree'; // Substitua pela sua URI do MongoDB
mongoose.connect(mongoURI, {})
    .then(() => console.log('Conectado ao MongoDB'))
    .catch(err => console.error('Erro ao conectar ao MongoDB', err));

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    active: Boolean,
    value: Number,
});

const Service = mongoose.model('Service', serviceSchema);

server.get('/service/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const service = await Service.findById(id);
        if (!service) return res.status(404).json({ message: 'Serviço não encontrado' });
        return res.json(service);
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao buscar serviço', error });
    }
});

server.get('/service', async (req, res) => {
    try {
        const services = await Service.find();
        return res.json(services);
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao buscar serviços', error });
    }
});

server.post('/service', async (req, res) => {
    const { name, value, description, active } = req.body;
    try {
        const existingService = await Service.findOne({ name });
        if (existingService) {
            return res.status(400).json({ message: 'Serviço já existe' });
        }

        const service = new Service({ name, value, description, active });
        await service.save();
        
        return res.json(service);
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao criar serviço', error });
    }
});



server.put('/service/:id', async (req, res) => {
    const { id } = req.params; // Corrigido para usar req.params.id
    const { name, value, description, active } = req.body;
    try {
        const service = await Service.findByIdAndUpdate(id, { name, value, description, active }, { new: true });
        if (!service) return res.status(404).json({ message: 'Serviço não encontrado' });
        return res.json(service);
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao atualizar serviço', error });
    }
});

server.delete('/service/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const service = await Service.findByIdAndDelete(id);
        if (!service) return res.status(404).json({ message: 'Serviço não encontrado' });
        return res.json({ message: 'Serviço deletado' });
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao deletar serviço', error });
    }
});

server.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
