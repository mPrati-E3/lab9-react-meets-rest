import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import moment from 'moment';

// Component to draw the optional form
class TodoForm extends React.Component {

  // Constructor to set the state using the given props
  constructor(props) {
    super(props);
    if(this.props.task){
      this.state = {...this.props.task};
      if(this.props.task.deadline){
        this.state.deadlineDate = this.props.task.deadline.format("YYYY-MM-DD");
        this.state.deadlineTime = this.props.task.deadline.format("HH:mm");
      }
    } else {
      this.state = {description: '', project: '', important: false, privateTask: true, deadlineDate: '', deadlineTime: ''};
    }
  }

  // Method to update a single object field by changing the state
  updateField = (name, value) => {
    this.setState({[name]: value});
  }

  // Method to handle the submit of the form
  handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
    } else {
      let task = Object.assign({}, this.state);
      // set a single deadline
      if(task.deadlineDate !== "" && task.deadlineTime !== "")
        task.deadline = moment(task.deadlineDate + " " + task.deadlineTime);
      else if(task.deadlineDate !== "")
        task.deadline = moment(task.deadlineDate);
      
      this.props.addOrEditTask(task);
      this.props.toggleModal();
    }
  }

  // Mandatory render function to draw the form in Modal
  render() {
    return(
      <Modal show={this.props.modalOpen} onHide={this.props.toggleModal} animation={false}>

        {/* HEADER & TITLE */}
        <Modal.Header closeButton>
          <Modal.Title>Add a Task</Modal.Title>
        </Modal.Header>
        <Form method="POST" onSubmit={(event) => this.handleSubmit(event)}>

          <Modal.Body>

            {/* DESCRIPTION */}
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control type="text" name="description" placeholder="Type a description..." value = {this.state.description} onChange={(ev) => this.updateField(ev.target.name, ev.target.value)} required autoFocus/>
            </Form.Group>

            {/* PROJECT */}
            <Form.Group controlId="project">
              <Form.Label>Project</Form.Label>
              <Form.Control type="text" name="project" placeholder="Type a project for the task..." value = {this.state.project} onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}/>
            </Form.Group>

            {/* IMPORTANT */}
            <Form.Group controlId="important">
              <Form.Check type="checkbox" label="Important" id="important" name="important" checked = {this.state.important} onChange={(ev) => this.updateField(ev.target.name, ev.target.checked)} />
            </Form.Group>

            {/* PRIVATE */}
            <Form.Group controlId="private">
              <Form.Check type="checkbox" label="Private" id="private" name="privateTask" onChange={(ev) => this.updateField(ev.target.name, ev.target.checked)} checked={this.state.privateTask}/>
            </Form.Group>

            {/* DATE */}
            <Form.Group controlId="deadline-date">
              <Form.Label>Deadline</Form.Label>
              <Form.Control type="date" name="deadlineDate" value = {this.state.deadlineDate} onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}/>
            </Form.Group>
            <Form.Group controlId="deadline-time">
              <Form.Control type="time" name="deadlineTime" value = {this.state.deadlineTime} onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}/>
            </Form.Group>

          </Modal.Body>

          {/* FOOTER BUTTON */}
          <Modal.Footer>
            <Button variant="primary" type="submit">{this.state.id? 'Update': 'Add'}</Button>
          </Modal.Footer>
          
        </Form>
      </Modal>
    );
    
  }
}

export default TodoForm;