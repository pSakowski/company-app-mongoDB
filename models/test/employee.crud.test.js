const Employee = require('../employee.model');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Employee', () => {

  before(async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/companyDBtest', { useNewUrlParser: true, useUnifiedTopology: true });
    } catch (err) {
      console.error(err);
    }
  });

  describe('Reading data', () => {
  
    before(async () => {
      const testEmpOne = new Employee({ firstName: 'John', lastName: 'Doe', department: 'IT' });
      await testEmpOne.save();
    
      const testEmpTwo = new Employee({ firstName: 'Jane', lastName: 'Doe', department: 'HR' });
      await testEmpTwo.save();
    });
  
    it('should return all the data with "find" method', async () => {
      const employees = await Employee.find();
      const expectedLength = 2;
      expect(employees.length).to.be.equal(expectedLength);
    });
  
    it('should return a proper document by "name" with "findOne" method', async () => {
      const employee = await Employee.findOne({ firstName: 'John' });
      const expectedFirstName = 'John';
      expect(employee.firstName).to.be.equal(expectedFirstName);
    });
    
    it('should return proper documents by "department" with "find" method', async () => {
      const employees = await Employee.find({ department: 'IT' });
      const expectedLength = 1;
      expect(employees.length).to.be.equal(expectedLength);
    });
    
    it('should return proper documents by "last name" with "find" method', async () => {
      const employees = await Employee.find({ lastName: 'Doe' });
      const expectedLength = 2;
      expect(employees.length).to.be.equal(expectedLength);
    });
    
    after(async () => {
      await Employee.deleteMany();
    });
  });

  describe('Creating data', () => {

    afterEach(async () => {
      await Employee.deleteMany();
    });
  
    it('should insert new document with "insertOne" method', async () => {
      const employee = new Employee({ firstName: 'John', lastName: 'Doe', department: 'IT' });
      await employee.save();
      expect(employee.isNew).to.be.false;
    });
    
    it('should insert new document with "create" method', async () => {
      await Employee.create({ firstName: 'Jane', lastName: 'Doe', department: 'HR' });
      const employee = await Employee.findOne({ firstName: 'Jane' });
      expect(employee.lastName).to.equal('Doe');
    });
    
    it('should correctly insert multiple documents with "insertMany" method', async () => {
      const employees = [
        { firstName: 'John', lastName: 'Doe', department: 'IT' },
        { firstName: 'Jane', lastName: 'Doe', department: 'HR' },
      ];
      await Employee.insertMany(employees);
      const foundEmployees = await Employee.find();
      const expectedLength = 2;
      expect(foundEmployees.length).to.equal(expectedLength);
    });
  
    it('should throw an error if required fields are missing', async () => {
      const employee = new Employee({ lastName: 'Doe', department: 'IT' });
      let error = null;
      try {
        await employee.save();
      } catch (err) {
        error = err;
      }
      expect(error).to.exist;
      expect(error.errors.firstName).to.exist;
    });
  });  

  describe('Updating data', () => {

    beforeEach(async () => {
      const testEmpOne = new Employee({ firstName: 'John', lastName: 'Doe', department: 'IT' });
      await testEmpOne.save();
  
      const testEmpTwo = new Employee({ firstName: 'Jane', lastName: 'Doe', department: 'HR' });
      await testEmpTwo.save();
    });
  
    afterEach(async () => {
      await Employee.deleteMany();
    });
  
    it('should properly update one document with "updateOne" method', async () => {
      await Employee.updateOne({ firstName: 'John' }, { $set: { firstName: 'Jonathan' }});
      const updatedEmployee = await Employee.findOne({ firstName: 'Jonathan' });
      expect(updatedEmployee).to.not.be.null;
    });
  
    it('should properly update one document with "save" method', async () => {
      const employee = await Employee.findOne({ firstName: 'John' });
      employee.firstName = 'Jonathan';
      await employee.save();
      const updatedEmployee = await Employee.findOne({ firstName: 'Jonathan' });
      expect(updatedEmployee).to.not.be.null;
    });
  
    it('should properly update multiple documents with "updateMany" method', async () => {
      await Employee.updateMany({ lastName: 'Doe' }, { $set: { lastName: 'Johnson' }});
      const employees = await Employee.find();
      expect(employees[0].lastName).to.be.equal('Johnson');
      expect(employees[1].lastName).to.be.equal('Johnson');
    });
  });
  

  describe('Removing data', () => {

    beforeEach(async () => {
      const testEmpOne = new Employee({ firstName: 'John', lastName: 'Doe', department: 'IT' });
      await testEmpOne.save();
    
      const testEmpTwo = new Employee({ firstName: 'Jane', lastName: 'Doe', department: 'HR' });
      await testEmpTwo.save();
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });

    it('should properly remove one document with "deleteOne" method', async () => {
      await Employee.deleteOne({ firstName: 'John' });
      const deletedEmployee = await Employee.findOne({ firstName: 'John' });
      expect(deletedEmployee).to.be.null;
    });
    
    it('should properly remove one document with "remove" method', async () => {
      const employee = await Employee.findOne({ firstName: 'John' });
      await employee.remove();
      const removedEmployee = await Employee.findOne({ firstName: 'John' });
      expect(removedEmployee).to.be.null;
    });
    
    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employee.deleteMany();
      const employees = await Employee.find();
      expect(employees.length).to.be.equal(0);
    });
  });
});
