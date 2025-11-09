import { useEffect, useState } from 'react'
import { Card, CardBody, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import PageBreadcrumb from '@/components/layout/PageBreadcrumb'
import PageMetaData from '@/components/PageTitle'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useGlobalContext } from '@/context/useGlobalContext'
import ContactsListTable from './components/ContactsListTable'

const Contacts = () => {
  const { getAllContacts } = useGlobalContext()
  const [contactsList, setContactsList] = useState([])

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await getAllContacts()
        setContactsList(data)
      } catch (error) {
        console.error('Error fetching contacts:', error)
      }
    }
    fetchContacts()
  }, [getAllContacts])

  return (
    <>
      <PageMetaData title="Contacts List" />
      <PageBreadcrumb title="Contacts List" subName="Atrch" />
      <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="d-flex flex-wrap justify-content-between gap-3">
                {/* <div className="search-bar">
                  <span>
                    <IconifyIcon icon="bx:search-alt" className="mb-1" />
                  </span>
                  <input type="search" className="form-control" id="search" placeholder="Search ..." />
                </div> */}
                <div>
                  <Link to="/ecommerce/contacts/create" className="btn btn-primary d-flex align-items-center">
                    <IconifyIcon icon="bx:plus" className="me-1" />
                    Create Contact
                  </Link>
                </div>
              </div>
            </CardBody>
            <div>
              {contactsList.length > 0 ? <ContactsListTable contacts={contactsList} /> : <div className="text-center p-4">No contacts found</div>}
            </div>
          </Card>
        </Col>
      </Row>
    </>
  )
}
export default Contacts
