package smart_campus_backend.resource.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import smart_campus_backend.resource.dto.ResourceDTO;
import smart_campus_backend.resource.model.CampusResource;
import smart_campus_backend.resource.model.ResourceStatus;
import smart_campus_backend.resource.model.ResourceType;
import smart_campus_backend.resource.repository.CampusResourceRepository;

@Service
public class CampusResourceService {

    private final CampusResourceRepository repository;

    public CampusResourceService(CampusResourceRepository repository) {
        this.repository = repository;
    }

    public Page<ResourceDTO> getResources(ResourceType type, ResourceStatus status, Integer capacity, Pageable pageable) {
        Page<CampusResource> resources = repository.findActiveResourcesWithFilters(type, status, capacity, pageable);
        return resources.map(this::convertToDTO);
    }

    public ResourceDTO createResource(ResourceDTO dto) {
        CampusResource resource = new CampusResource();
        mapDtoToEntity(dto, resource);
        resource.setDeleted(false);
        CampusResource saved = repository.save(resource);
        return convertToDTO(saved);
    }

    public ResourceDTO updateResource(Long id, ResourceDTO dto) {
        CampusResource resource = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Resource not found"));
        
        if (resource.isDeleted()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Resource not found");
        }

        mapDtoToEntity(dto, resource);
        CampusResource saved = repository.save(resource);
        return convertToDTO(saved);
    }

    public void deleteResource(Long id) {
        CampusResource resource = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Resource not found"));
        
        resource.setDeleted(true);
        repository.save(resource);
    }

    private void mapDtoToEntity(ResourceDTO dto, CampusResource entity) {
        entity.setName(dto.getName());
        entity.setType(dto.getType());
        entity.setCapacity(dto.getCapacity());
        entity.setLocation(dto.getLocation());
        entity.setStatus(dto.getStatus());
        entity.setImageUrl(dto.getImageUrl());
    }

    private ResourceDTO convertToDTO(CampusResource entity) {
        ResourceDTO dto = new ResourceDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setType(entity.getType());
        dto.setCapacity(entity.getCapacity());
        dto.setLocation(entity.getLocation());
        dto.setStatus(entity.getStatus());
        dto.setImageUrl(entity.getImageUrl());
        return dto;
    }
}
