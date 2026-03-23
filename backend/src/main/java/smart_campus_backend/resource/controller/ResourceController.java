package smart_campus_backend.resource.controller;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import smart_campus_backend.resource.dto.ResourceDTO;
import smart_campus_backend.resource.model.ResourceStatus;
import smart_campus_backend.resource.model.ResourceType;
import smart_campus_backend.resource.service.CampusResourceService;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "*")
public class ResourceController {

    private final CampusResourceService service;

    public ResourceController(CampusResourceService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<Page<ResourceDTO>> getResources(
            @RequestParam(required = false) ResourceType type,
            @RequestParam(required = false) ResourceStatus status,
            @RequestParam(required = false) Integer capacity,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        return ResponseEntity.ok(service.getResources(type, status, capacity, pageable));
    }

    @PostMapping
    public ResponseEntity<ResourceDTO> createResource(@Valid @RequestBody ResourceDTO dto) {
        ResourceDTO created = service.createResource(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResourceDTO> updateResource(@PathVariable Long id, @Valid @RequestBody ResourceDTO dto) {
        ResourceDTO updated = service.updateResource(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        service.deleteResource(id);
        return ResponseEntity.noContent().build();
    }
}
