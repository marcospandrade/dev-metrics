'use client';

import { SearchInput } from '@/components/common/SearchInput';
import {
  Button,
  Card,
  CardBody,
  Typography,
  Dialog,
  DialogBody,
  DialogHeader,
} from '@/lib/material';
import { AtlassianCustomField } from '@/services/projects/dto/get-all-custom-fields.dto';
import projectsService from '@/services/projects/projects.service';
import { List, ListItem } from '@material-tailwind/react';
import { Divider, ListItemText } from '@mui/material';
import { useEffect, useState } from 'react';
import { RelevantCustomFieldMap } from '../../../constants/relevant-custom-fields';

interface SecondStepProps {
  selectedProjectId: string;
  relevantCustomFields: RelevantCustomFieldMap;
  handleSetRelevantCustomFields: (fieldName: string, value: AtlassianCustomField) => void;
}

export function SecondStep({
  selectedProjectId,
  relevantCustomFields,
  handleSetRelevantCustomFields,
}: Readonly<SecondStepProps>) {
  const [customFields, setCustomFields] = useState<AtlassianCustomField[]>([]);
  const [filteredCustomFields, setFilteredCustomFields] = useState<AtlassianCustomField[]>([]);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  function handleOpen(fieldSelected: string) {
    setSelectedField(fieldSelected);
    setModalIsOpen(!modalIsOpen);
  }

  async function onLoadCustomFields() {
    const customFields = await projectsService.getAllCustomFields(selectedProjectId);
    setCustomFields(customFields);
    setFilteredCustomFields(customFields);
  }

  async function onChangeSearchField(text: string) {
    if (!text) {
      setFilteredCustomFields(customFields);
    }
    const filteredFields = customFields.filter((field) =>
      field.name.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredCustomFields(filteredFields);
  }

  async function onSelectCustomField(relevantField: string, selectedField: AtlassianCustomField) {
    handleSetRelevantCustomFields(relevantField, selectedField);
    setModalIsOpen(false);
  }

  function onClearSelection(fieldName: string) {
    handleSetRelevantCustomFields(fieldName, {} as AtlassianCustomField);
  }

  useEffect(() => {
    onLoadCustomFields();
  }, []);

  return (
    <>
      <Card className="mt-5 flex flex-1">
        <CardBody>
          <Typography variant="paragraph" className="mb-8">
            Click in the button to open the list of Custom Fields from Jira, then you will need to
            select the representative field
          </Typography>

          <Divider />

          <div className="mt-8 flex flex-1 flex-col gap-y-8 px-4">
            <div className="flex flex-1 flex-row items-center">
              <div className="mr-8 flex flex-row">
                <Typography variant="h5" className="mr-4">
                  Sprint:
                </Typography>
                <Typography variant="paragraph">
                  {relevantCustomFields.Sprint?.id ? relevantCustomFields.Sprint.id : ''}
                </Typography>
              </div>
              <Button className="mr-4" color="light-blue" onClick={() => handleOpen('Sprint')}>
                {relevantCustomFields.Sprint?.id ? `Re-Select` : 'Select field'}
              </Button>
              {!!relevantCustomFields.Sprint?.id && (
                <Button color="deep-orange" onClick={() => onClearSelection('Sprint')}>
                  Clear
                </Button>
              )}
            </div>

            <div className="flex flex-1 flex-row items-center">
              <div className="mr-8 flex flex-row">
                <Typography variant="h5" className="mr-4">
                  Story Point:
                </Typography>
                <Typography variant="paragraph">
                  {relevantCustomFields['Story Point']?.id
                    ? relevantCustomFields['Story Point'].id
                    : ''}
                </Typography>
              </div>
              <Button className="mr-4" color="light-blue" onClick={() => handleOpen('Story Point')}>
                {relevantCustomFields['Story Point']?.id ? 'Re-Select' : 'Select field'}
              </Button>
              {!!relevantCustomFields['Story Point']?.id && (
                <Button color="deep-orange" onClick={() => onClearSelection('Story Point')}>
                  {'Clear'}
                </Button>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      <Dialog
        open={modalIsOpen}
        handler={handleOpen}
        size="xl"
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader>List of Custom Fields</DialogHeader>
        <DialogBody className="h-[40rem] overflow-scroll">
          <div>
            <div className="flex flex-row justify-between">
              <h5 className="font-bold">Select the representative field for: {selectedField}</h5>
              <SearchInput
                searchInputPlaceholder="Search for custom fields here"
                onChangeSearchInput={onChangeSearchField}
              />
            </div>
            <List className="grid grid-cols-3">
              {!!selectedField &&
                filteredCustomFields.map((customField) => (
                  <ListItem
                    key={customField.id}
                    className="flex"
                    onClick={() => onSelectCustomField(selectedField, customField)}
                  >
                    <ListItemText primary={customField.name} />
                  </ListItem>
                ))}
            </List>
          </div>
        </DialogBody>
      </Dialog>
    </>
  );
}
