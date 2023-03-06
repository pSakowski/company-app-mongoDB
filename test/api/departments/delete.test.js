const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server');
const Department = require('../../../models/department.model');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('DELETE /api/departments', () => {

  before(async () => {
    const testDepOne = new Department({ name: 'Department #1' });
    await testDepOne.save();

    const testDepTwo = new Department({ name: 'Department #2' });
    await testDepTwo.save();
  });

  it('should delete document with selected id', async () => {
    const departments = await Department.find();
    const departmentId = departments[0]._id;

    const res = await request(server).delete('/api/departments/' + departmentId);
    const deletedDepartment = await Department.findById(departmentId);

    expect(res.status).to.be.equal(200);
    expect(deletedDepartment).to.be.null;
  });

  after(async () => {
    await Department.deleteMany();
  });

});
